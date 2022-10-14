import { App } from './app';
import { LoggerService } from './logger/LoggerService';
import { UserController } from './user/UserController';
import { ExceptionFilter } from './errors/ExceptionFilter';

async function bootstrap() {
  const logger: LoggerService = new LoggerService();

  const app = new App(
    logger,
    new UserController(logger),
    new ExceptionFilter(logger)
  );

  await app.init();
}

bootstrap();
