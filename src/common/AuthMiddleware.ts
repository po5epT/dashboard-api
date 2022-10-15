import { IMiddleware } from './MiddlewareInterface';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const [_, jwt] = req.headers.authorization.split(' ');
			verify(jwt, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					req.user = { email: (payload as JwtPayload).email };
					next();
				}
			});
		}

		next();
	}
}
