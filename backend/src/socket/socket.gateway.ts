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

@WebSocketGateway(8000, { cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Socket server is running');
  }

  handleConnection(client: Socket) {
    console.log(`connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`disconnect: ${client.id}`);
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket()
    socket: Socket,
    @MessageBody() answer: RTCSessionDescriptionInit,
  ) {
    socket.broadcast.emit('answer', answer);
  }
  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() offer: RTCSessionDescriptionInit,
  ) {
    socket.broadcast.emit('offer', offer);
  }

  //RTCIceCandidate
  @SubscribeMessage('icecandidate')
  handleIcecandidate(
    @ConnectedSocket() socket: Socket,
    @MessageBody() icecandidate: RTCSessionDescriptionInit,
  ) {
    socket.broadcast.emit('icecandidate', icecandidate);
  }
}
