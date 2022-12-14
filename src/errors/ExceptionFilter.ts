import { NextFunction, Request, Response } from 'express';
import { HTTPError } from './HTTPError';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/LoggerService';
import { TYPES } from '../types';
import 'reflect-metadata';

const DEFAULT_STATUS_CODE = 500;

export interface IExceptionFilter {
	catch: (err: Error, req: Request, res: Response, next: NextFunction) => void;
}

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this.logger = logger;
	}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
			res.status(err.statusCode).send({ error: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(DEFAULT_STATUS_CODE).send({ error: err.message });
		}
	}
}
