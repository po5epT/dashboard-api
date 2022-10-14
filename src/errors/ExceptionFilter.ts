import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/LoggerService';
import { IExceptionFilter } from './ExceptionFilterInterface';
import { HTTPError } from './HTTPError';

const DEFAULT_STATUS_CODE = 500;

export class ExceptionFilter implements IExceptionFilter{
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HTTPError) {
      this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({ error: err.message });
    } else {
      this.logger.error(`${err.message}`);
      res.status(DEFAULT_STATUS_CODE).send({ error: err.message });
    }
  }
}
