import { IMiddleware } from './MiddlewareInterface';
import { NextFunction, Request, Response } from 'express';

export class GuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}

		res.status(401).send({ error: 'User is not authorized' });
	}
}
