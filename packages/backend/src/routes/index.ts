import { Application, Request, Response, Router } from 'express';
import { buildTodoController } from '../modules/todo';
import { MainEnv } from '../services';

/**
 * GET /
 * Home page.
 */
export const indexRoute = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ hello: 'world' });
};

export function bootstrapRoutes(app: Application, services: MainEnv) {
  const index = Router();

  index.get('/api/', indexRoute);

  // TODO auto-bootstrap
  const routes = [...buildTodoController(services)];

  routes.forEach(({ path, method, handler }) => index[method](path, handler));

  app.use('/', index);
}
