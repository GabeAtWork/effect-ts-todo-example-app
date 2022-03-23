import {
  Router,
  RequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import * as controller from '../controllers/index';
import { RequestWithContext } from '../types';

export const index = Router();

// TODO change this to use effects maybe?
type ControllerFn = (
  req: RequestWithContext,
  res: Response,
  next: NextFunction,
) => void;

const assertRequestWithContext =
  (controllerFn: ControllerFn): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any as { context: unknown }).context) {
      throw new Error('Context was not provided');
    }

    return controllerFn(req as any as RequestWithContext, res, next);
  };

index.get('/api/', assertRequestWithContext(controller.index));
index.get('/api/todos', assertRequestWithContext(controller.getTodos));
