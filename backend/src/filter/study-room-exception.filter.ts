import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class StudyRoomExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    console.log(`study room exception : ${error}`);
  }
}
