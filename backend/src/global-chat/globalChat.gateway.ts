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

@WebSocketGateway({ cors: true, path: '/globalChat', namespace: 'globalChat' })
export class globalChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('globalChat socket server is running');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`connected: ${client.id}`);
    client.on('disconnecting', () => {
      console.log(client.id);
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
  }
}
