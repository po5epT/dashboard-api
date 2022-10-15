import { inject, injectable } from 'inversify';
import { BaseController } from '../common/BaseController';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/HTTPError';
import { TYPES } from '../types';
import { ILogger } from '../logger/LoggerInterface';
import 'reflect-metadata';
import { IUserController } from './UserControllerInterface';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserEntity } from './UserEntity';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				handler: this.login,
			},
			{
				path: '/register',
				method: 'post',
				handler: this.register,
			},
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		//this.ok(res, 'Login success!');
		console.log(req.body);
		next(new HTTPError(401, 'Not authorized', 'login'));
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = new UserEntity(body.email, body.name);
		await newUser.setPassword(body.password);

		this.ok(res, newUser);
	}
}
