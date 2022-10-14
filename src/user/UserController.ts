import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/LoggerService';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/HTTPError';

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);

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
      }
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    //this.ok(res, 'Login success!');
    next(new HTTPError(401, 'Not authorized', 'login'));
  }

  register(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'Register success!');
  }
}
