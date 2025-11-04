import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let errorResponse: any;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorResponse =
        typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { message: exception.message };
      this.logger.error(
        `HTTP Status: ${status} Error Message: ${JSON.stringify(errorResponse)}`,
      );
    } else if (exception instanceof Error) {
      errorResponse = {
        message: 'Internal server error',
      };
      this.logger.error(
        `HTTP Status: ${status}\nError Message: ${exception.message}\nStack Trace:\n${exception.stack}\n`,
      );
    } else {
      errorResponse = { message: 'Unknown error' };
      this.logger.error(
        `HTTP Status: ${status} Error Message: ${JSON.stringify(errorResponse)}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorResponse,
    });
  }
}
