import { App } from './app';
import { LoggerService } from './logger/LoggerService';
import { ILogger } from './logger/LoggerInterface';
import { UserController } from './user/UserController';
import { ExceptionFilter } from './errors/ExceptionFilter';
import { IExceptionFilter } from './errors/ExceptionFilterInterface';
import { IUserController } from './user/UserControllerInterface';
import { IUserService, UserService } from './user/UserService';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ConfigService, IConfigService } from './config/ConfigService';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap(): { appContainer: Container; app: App } {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
