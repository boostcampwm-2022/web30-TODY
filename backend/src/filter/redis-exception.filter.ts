import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class RedisExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    console.log(`redis exception : ${error}`);
  }
}
