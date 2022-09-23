import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { CannotCreateEntityIdMapError } from 'typeorm/error/CannotCreateEntityIdMapError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let sendBackMessage =
      'Sorry something is wrong with our server, please try again later';
    Logger.error(
      exception,
      (exception as any).stack,
      `${req.method} ${req.url}`,
    );

    let status: HttpStatus;

    switch (exception.constructor) {
      case TypeORMError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        sendBackMessage =
          'Parameters you have been given causes sql problem, please make sure that they are correct';
        break;
      case HttpException:
        status = (exception as HttpException).getStatus();
        break;
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        sendBackMessage = (exception as QueryFailedError).message;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        sendBackMessage = (exception as EntityNotFoundError).message;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        sendBackMessage = (exception as CannotCreateEntityIdMapError).message;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    res.status(status).json(GlobalResponseError(status, sendBackMessage));
  }
}

export const GlobalResponseError: (
  statusCode: number,
  message: string,
) => IResponseError = (statusCode: number, message: string): IResponseError => {
  return {
    statusCode: statusCode,
    message,
  };
};

export interface IResponseError {
  statusCode: number;
  message: string;
}
