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

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): { appContainer: Container; app: App } {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
