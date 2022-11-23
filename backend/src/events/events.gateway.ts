import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  //   afterInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(8000)
export class EventsGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('test');

  // @afterInit(server: Server) {
  //   this.logger.log('init');
  // }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }
}
