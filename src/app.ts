import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/LoggerService';
import { TYPES } from './types';
import { IConfigService } from './config/ConfigService';
import { IExceptionFilter } from './errors/ExceptionFilter';
import { UserController } from './user/UserController';
import { PrismaService } from './database/PrismaService';
import 'reflect-metadata';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 3000;
	}

	useMiddleware(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server has started on port ${this.port}`);
	}
}
