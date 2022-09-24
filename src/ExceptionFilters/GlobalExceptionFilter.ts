import {
  ArgumentsHost,
  BadRequestException,
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
    // for now, decrease information about query fail  cause strategy has been taken in case of safety,
    // that's why sendBack message is hardcoded not taken from e.message
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
        sendBackMessage =
          'OPERATION ABORTED: Possibly bad data object has been given.';
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        sendBackMessage =
          'OPERATION ABORTED: Possibly bad data object has been given.';

        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        sendBackMessage =
          'OPERATION ABORTED: Possibly bad data object has been given.';

        break;
      case BadRequestException:
        status = HttpStatus.BAD_REQUEST;
        const message = (
          (
            exception as BadRequestException
          ).getResponse() as IResBadReqException
        )?.message;
        sendBackMessage = message[0] ?? 'Bad Request';
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

interface IResBadReqException {
  statusCode: string;
  error: string;
  message: Array<string>;
}
