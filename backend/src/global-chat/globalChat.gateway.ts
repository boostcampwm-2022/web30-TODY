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
import { SocketExceptionsFilter } from 'src/filter/socket-exceptions.filter';

@UseFilters(new SocketExceptionsFilter())
@WebSocketGateway({ cors: true, path: '/globalChat' })
export class globalChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('globalChat socket server is running');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(`connected: ${client.id}`);
    client.join('global');
    client.on('disconnecting', () => {
      console.log(client.id);
    });
  }

  async handleDisconnect(client: Socket) {
    console.log(`disconnect: ${client.id}`);
  }

  @SubscribeMessage('globalChat')
  async handleGlobalChat(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() body: { nickname: string; chat: string },
  ) {
    client.broadcast
      .to('global')
      .emit('globalChat', { nickname: body.nickname, chat: body.chat });
  }
}
