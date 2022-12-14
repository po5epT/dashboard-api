import { Response, Router } from 'express';
import { IControllerRoute } from './RouteInterface';
import { ILogger } from '../logger/LoggerService';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response {
		res.type('application/json');
		res.status(code);

		return res.json(message);
	}

	public ok<T>(res: Response, message: T): Response {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): Response {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const boundHandler = route.handler.bind(this);
			const pipeline = middlewares ? [...middlewares, boundHandler] : boundHandler;

			this.router[route.method](route.path, pipeline);
		}
	}
}
