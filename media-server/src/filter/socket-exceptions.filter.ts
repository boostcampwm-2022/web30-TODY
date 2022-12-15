import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class SocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
    if (exception instanceof WsException) {
      console.log(`WsException : ${exception.message}`);
      return;
    }
    console.log('unexpected socket error.');
  }
}
