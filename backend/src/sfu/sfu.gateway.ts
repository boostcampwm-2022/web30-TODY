import { UseFilters } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import SFU_EVENTS from 'src/constants/sfuEvents';
import { getCanvasBody, getChatBody } from 'src/utils/sendDcBodyFormatter';
import { SocketExceptionsFilter } from 'src/filter/socket-exceptions.filter';
import * as wrtc from 'wrtc';
import axios from 'axios';

const receivePcs: { [id: string]: RTCPeerConnection } = {};
const sendPcs: { [id: string]: { [targetId: string]: RTCPeerConnection } } = {};
const sendDcs: { [id: string]: { [targetId: string]: RTCDataChannel } } = {};
const streams: { [id: string]: MediaStream[] } = {};
const RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@UseFilters(new SocketExceptionsFilter())
@WebSocketGateway({ cors: true, path: '/sfu' })
export class SfuGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('sfu Socket server is running');
  }

  async handleConnection(client: Socket) {
    console.log(`connected: ${client.id}`);
    client.on(SFU_EVENTS.DISCONNECTING, () => {
      const roomName = [...client.rooms].filter(
        (roomName) => roomName !== client.id,
      )[0];
      if (receivePcs[client.id]) {
        receivePcs[client.id].close();
        delete receivePcs[client.id];
      }
      if (sendPcs[client.id]) {
        Object.values(sendPcs[client.id]).forEach((sendPc) => sendPc.close());
        delete sendPcs[client.id];
      }
      if (sendDcs[client.id]) {
        Object.values(sendDcs[client.id]).forEach((sendDc) => sendDc.close());
        delete sendDcs[client.id];
      }
      client.to(roomName).emit(SFU_EVENTS.SOMEONE_LEFT_ROOM, {
        peerId: client.id,
        userName: client.data.userName,
      });
    });
  }

  async handleDisconnect(client: Socket) {
    try {
      await axios
        .create({ baseURL: process.env.API_URL })
        .post('/user/leaveRoom', {
          studyRoomId: client.data.roomId,
          userId: client.data.userId,
        });
    } catch (e) {
      console.log(e);
    }
    console.log(`disconnect: ${client.id}`);
  }

  @SubscribeMessage('deleteRoom')
  async handleDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const clientRoom = [...client.rooms].filter(
      (roomName) => roomName !== client.id,
    )[0];
    console.log(typeof roomId);
    console.log(typeof clientRoom);
    // console.log('deletedRoomId: ', roomId, clientRoom);
    // console.log(clientRoom === roomId);
    client.broadcast.to(clientRoom).emit('deletedThisRoom');
  }

  @SubscribeMessage(SFU_EVENTS.JOIN)
  async handleJoin(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() roomName: any,
  ) {
    client.join(roomName);
    const socketsInRoom = await this.server.in(roomName).fetchSockets();
    const peerIdsInRoom = socketsInRoom
      .filter((socket) => socket.id !== client.id)
      .map((socket) => socket.id);

    const userNames = {};
    socketsInRoom.forEach((socket) => {
      if (socket.id !== client.id) userNames[socket.id] = socket.data.userName;
    });
    client.emit(SFU_EVENTS.NOTICE_ALL_PEERS, { peerIdsInRoom, userNames });
  }

  @SubscribeMessage(SFU_EVENTS.SENDER_OFFER)
  async handleSenderOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() { offer, userData }: any,
  ) {
    client.data = { ...userData };

    const roomName = [...client.rooms].filter(
      (roomName) => roomName !== client.id,
    )[0];
    client.broadcast.to(roomName).emit(SFU_EVENTS.NEW_PEER, {
      peerId: client.id,
      userName: client.data.userName,
    });

    const receivePc: RTCPeerConnection = new wrtc.RTCPeerConnection(
      RTCConfiguration,
    );
    receivePcs[client.id] = receivePc;
    receivePc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      client.emit(SFU_EVENTS.RECEIVER_ICECANDIDATE, {
        icecandidate: ice.candidate,
      });
    };
    receivePc.ontrack = async (track: RTCTrackEvent) => {
      streams[client.id]
        ? streams[client.id].push(track.streams[0])
        : (streams[client.id] = [track.streams[0]]);
      if (streams[client.id].length > 1) return;
    };

    receivePc.ondatachannel = (e: RTCDataChannelEvent) => {
      const datachannel = e.channel;
      datachannel.onmessage = (e: MessageEvent) => {
        const body = JSON.parse(e.data);
        const formattedBody =
          body.type === 'chat'
            ? getChatBody(body, client.id)
            : getCanvasBody(body, client.id);
        datachannel.send(JSON.stringify(formattedBody));
        Object.entries(sendDcs).forEach(([toId, object]) => {
          const sendDc = object[client.id];
          if (!sendDc) return;
          sendDc.send(JSON.stringify(formattedBody));
        });
      };
    };

    await receivePc.setRemoteDescription(offer);
    const answer = await receivePc.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await receivePc.setLocalDescription(answer);
    client.emit(SFU_EVENTS.SENDER_ANSWER, { answer });
  }

  @SubscribeMessage(SFU_EVENTS.RECEIVER_OFFER)
  async handleReceiverOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() { offer, targetId }: any,
  ) {
    const sendPc: RTCPeerConnection = new wrtc.RTCPeerConnection(
      RTCConfiguration,
    );

    await sendPc.setRemoteDescription(offer);
    sendPcs[client.id]
      ? (sendPcs[client.id][targetId] = sendPc)
      : (sendPcs[client.id] = { [targetId]: sendPc });

    sendPc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      client.emit(SFU_EVENTS.SENDER_ICECANDIDATE, {
        icecandidate: ice.candidate,
        targetId,
      });
    };

    sendPc.ondatachannel = (e: any) => {
      const datachannel = e.channel;
      sendDcs[client.id]
        ? (sendDcs[client.id][targetId] = datachannel)
        : (sendDcs[client.id] = { [targetId]: datachannel });
    };

    if (streams[targetId]) {
      const streamToSend = streams[targetId][0];
      streamToSend.getTracks().forEach((track: MediaStreamTrack) => {
        sendPc.addTrack(track, streamToSend);
      });
    }

    const answer = await sendPc.createAnswer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: false,
    });
    await sendPc.setLocalDescription(answer);
    client.emit(SFU_EVENTS.RECEIVER_ANSWER, { answer, targetId });
  }

  @SubscribeMessage(SFU_EVENTS.SENDER_ICECANDIDATE)
  async handleSenderIcecandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() { icecandidate }: any,
  ) {
    if (!icecandidate) return;
    const receivePc = receivePcs[client.id];
    await receivePc.addIceCandidate(icecandidate);
  }

  @SubscribeMessage(SFU_EVENTS.RECEIVER_ICECANDIDATE)
  async handleReceiverIcecandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() { icecandidate, targetId }: any,
  ) {
    const sendPc = sendPcs[client.id]?.[targetId];
    if (!icecandidate || !sendPc) return;
    await sendPc.addIceCandidate(icecandidate);
  }
}
