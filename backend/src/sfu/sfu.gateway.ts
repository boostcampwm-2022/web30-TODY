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
import * as wrtc from 'wrtc';

const receivePcs: { [id: string]: RTCPeerConnection } = {};
const sendPcs: { [id: string]: { [targetId: string]: RTCPeerConnection } } = {};
const sendDcs: { [id: string]: { [targetId: string]: RTCDataChannel } } = {};
const streams: { [id: string]: MediaStream[] } = {};
const RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@WebSocketGateway({ cors: true })
export class SfuGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket server is running');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
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
      client.to(roomName).emit(SFU_EVENTS.SOMEONE_LEFT_ROOM, client.id);
    });
  }

  async handleDisconnect(client: Socket) {
    console.log(`disconnect: ${client.id}`);
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
    client.emit(SFU_EVENTS.NOTICE_ALL_PEERS, peerIdsInRoom);
  }

  @SubscribeMessage(SFU_EVENTS.SENDER_OFFER)
  async handleSenderOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() { offer }: any,
  ) {
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
      const roomName = [...client.rooms].filter(
        (roomName) => roomName !== client.id,
      )[0];
      streams[client.id]
        ? streams[client.id].push(track.streams[0])
        : (streams[client.id] = [track.streams[0]]);
      if (streams[client.id].length > 1) return;
      client.broadcast
        .to(roomName)
        .emit(SFU_EVENTS.NEW_PEER, { peerId: client.id });
    };

    receivePc.ondatachannel = (e: RTCDataChannelEvent) => {
      const datachannel = e.channel;
      datachannel.onmessage = (e: MessageEvent) => {
        const body = JSON.parse(e.data);
        const formattedBody =
          body.type === 'chat'
            ? getChatBody(body, client.id)
            : getCanvasBody(body, client.id);
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

    const streamToSend = streams[targetId][0];
    streamToSend.getTracks().forEach((track: MediaStreamTrack) => {
      sendPc.addTrack(track, streamToSend);
    });

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
