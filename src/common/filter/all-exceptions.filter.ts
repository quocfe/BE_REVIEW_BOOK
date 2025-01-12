import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Kiểm tra nếu là HttpException
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Xử lý `message` từ exception response
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
      }
    } else if (exception instanceof Error) {
      // Nếu là lỗi không phải HttpException (Error thông thường)
      message = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      message: Array.isArray(message) ? message[0] : message, // Đảm bảo `message` luôn là mảng
    };

    // Gửi phản hồi lỗi
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
