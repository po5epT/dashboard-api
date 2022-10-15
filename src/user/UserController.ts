import { inject, injectable } from 'inversify';
import { BaseController } from '../common/BaseController';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/HTTPError';
import { TYPES } from '../types';
import { ILogger } from '../logger/LoggerService';
import 'reflect-metadata';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { IUserService } from './UserService';
import { ValidateMiddleware } from '../common/ValidateMiddleware';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);

		this.bindRoutes([
			{
				path: '/login',
				method: 'post',
				handler: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				handler: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);

		if (!result) {
			return next(new HTTPError(401, 'Not authorized', 'login'));
		}

		this.ok(res, 'Login success!');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, 'Such user is already exists', 'register'));
		}

		const { password, ...resResult } = result;
		this.ok(res, resResult);
	}
}
