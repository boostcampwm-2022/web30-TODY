import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
  handleAnswer(@MessageBody() data: string): string {
    return data;
  }
  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: string): string {
    return data;
  }
  @SubscribeMessage('icecandidate')
  handleIcecandidate(@MessageBody() data: string): string {
    return data;
  }
}
