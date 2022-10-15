import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';
import { BaseController } from '../common/BaseController';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/HTTPError';
import { TYPES } from '../types';
import { ILogger } from '../logger/LoggerService';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { IUserService } from './UserService';
import { ValidateMiddleware } from '../common/ValidateMiddleware';
import { IConfigService } from '../config/ConfigService';
import 'reflect-metadata';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	info: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				handler: this.info,
				middlewares: [],
			},
		]);
	}

	public async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);

		if (!result) {
			return next(new HTTPError(401, 'Not authorized', 'login'));
		}

		const secret = this.configService.get('SECRET');
		const jwt = await this.signJWT(body.email, secret);

		this.ok(res, { jwt });
	}

	public async register(
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

	public async info(
		{ user }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.ok(res, user);
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}

					resolve(token as string);
				},
			);
		});
	}
}
