import { App } from './app';
import { LoggerService } from './logger/LoggerService';
import { ILogger } from './logger/LoggerInterface';
import { UserController } from './user/UserController';
import { ExceptionFilter } from './errors/ExceptionFilter';
import { IExceptionFilter } from './errors/ExceptionFilterInterface';
import { Container } from 'inversify';
import { TYPES } from './types';

const appContainer = new Container();

appContainer.bind<ILogger>(TYPES.ILogger).to(LoggerService);
appContainer.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
appContainer.bind<UserController>(TYPES.UserController).to(UserController);
appContainer.bind<App>(TYPES.Application).to(App);

const app = appContainer.get<App>(TYPES.Application);
app.init();

export { app, appContainer };
