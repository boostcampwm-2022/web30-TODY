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

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket server is running');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`connected: ${client.id}`);
    client.on('disconnecting', () => {
      [...client.rooms].slice(1).forEach((roomName) => {
        client.to(roomName).emit('someone-left-your-room', client.id);
      });
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

  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() { answer, fromId, toId }: any,
  ) {
    this.server.to(toId).emit('answer', { answer, fromId, toId });
  }

  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() { offer, fromId, toId }: any,
  ) {
    this.server.to(toId).emit('offer', { offer, fromId, toId });
  }

  @SubscribeMessage('icecandidate')
  handleIcecandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() { icecandidate, fromId, toId }: any,
  ) {
    this.server.to(toId).emit('icecandidate', { icecandidate, fromId, toId });
  }
}
