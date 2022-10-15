import { App } from './app';
import { LoggerService, ILogger } from './logger/LoggerService';
import { UserController, IUserController } from './user/UserController';
import { ExceptionFilter, IExceptionFilter } from './errors/ExceptionFilter';
import { IUserService, UserService } from './user/UserService';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ConfigService, IConfigService } from './config/ConfigService';
import { PrismaService } from './database/PrismaService';
import { IUserRepository, UserRepository } from './user/UserRepository';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
});

function bootstrap(): { appContainer: Container; app: App } {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
