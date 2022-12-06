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
import * as wrtc from 'wrtc';

const receivePcs: { [id: string]: RTCPeerConnection } = {};
const sendPcs: { [id: string]: { [targetId: string]: RTCPeerConnection } } = {};
const streams: { [id: string]: MediaStream[] } = {};
const RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

@WebSocketGateway({ cors: true })
export class MediaServerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket server is running');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`connected: ${client.id}`);
    client.on('disconnecting', () => {
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
      client.to(roomName).emit('someone-left-room', client.id);
    });
  }

  async handleDisconnect(client: Socket) {
    console.log(`disconnect: ${client.id}`);
  }

  @SubscribeMessage('join')
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
    client.emit('notice-all-peers', peerIdsInRoom);
  }

  @SubscribeMessage('senderOffer')
  async handleSenderOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() { offer }: any,
  ) {
    const receivePc = new wrtc.RTCPeerConnection(RTCConfiguration);
    receivePcs[client.id] = receivePc;
    receivePc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      client.emit('receiverIcecandidate', { icecandidate: ice.candidate });
    };
    receivePc.ontrack = async (track: RTCTrackEvent) => {
      const roomName = [...client.rooms].filter(
        (roomName) => roomName !== client.id,
      )[0];
      streams[client.id]
        ? streams[client.id].push(track.streams[0])
        : (streams[client.id] = [track.streams[0]]);
      if (streams[client.id].length > 1) return;
      client.broadcast.to(roomName).emit('new-peer', { peerId: client.id });
    };

    await receivePc.setRemoteDescription(offer);
    const answer = await receivePc.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
    await receivePc.setLocalDescription(answer);
    client.emit('senderAnswer', { answer });
  }

  @SubscribeMessage('receiverOffer')
  async handleReceiverOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() { offer, targetId }: any,
  ) {
    const sendPc = new wrtc.RTCPeerConnection(RTCConfiguration);
    await sendPc.setRemoteDescription(offer);
    sendPcs[client.id]
      ? (sendPcs[client.id][targetId] = sendPc)
      : (sendPcs[client.id] = { [targetId]: sendPc });

    sendPc.onicecandidate = (ice: RTCPeerConnectionIceEvent) => {
      client.emit('senderIcecandidate', {
        icecandidate: ice.candidate,
        targetId,
      });
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
    client.emit('receiverAnswer', { answer, targetId });
  }

  @SubscribeMessage('senderIcecandidate')
  async handleSenderIcecandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() { icecandidate }: any,
  ) {
    if (!icecandidate) return;
    const receivePc = receivePcs[client.id];
    await receivePc.addIceCandidate(icecandidate);
  }

  @SubscribeMessage('receiverIcecandidate')
  async handleReceiverIcecandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() { icecandidate, targetId }: any,
  ) {
    const sendPc = sendPcs[client.id]?.[targetId];
    if (!icecandidate || !sendPc) return;
    await sendPc.addIceCandidate(icecandidate);
  }
}
