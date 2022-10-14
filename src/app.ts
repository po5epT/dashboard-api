import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/LoggerService';
import { UserController } from './user/UserController';
import { ExceptionFilter } from './errors/ExceptionFilter';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;
  userController: UserController;
  exceptionFilter: ExceptionFilter;

  constructor(logger: LoggerService, userController: UserController, exceptionFilter: ExceptionFilter) {
    this.app = express();
    this.port = 3000;
    this.logger = logger;
    this.userController = userController;
    this.exceptionFilter = exceptionFilter;
  }

  useRoutes() {
    this.app.use('/users', this.userController.router);
  }

  useExceptionFilters() {
    this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.useRoutes();
    this.useExceptionFilters();
    this.server = this.app.listen(this.port);
    this.logger.log(`Server has started on port ${this.port}`);
  }
}
