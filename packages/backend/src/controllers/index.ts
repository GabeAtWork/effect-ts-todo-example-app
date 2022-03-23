import { Response } from 'express';
import * as T from '@effect-ts/core/Effect';
import { TodoRepositoryDefinition, TodoRepository } from '../modules/todo';
import { pipe } from '@effect-ts/core';
import { executeEffectWithPromise } from '../util/promise';
import * as E from '@effect-ts/core/Either';
import { RequestWithContext } from '../types';

/**
 * GET /
 * Home page.
 */
export const index = async (
  req: RequestWithContext,
  res: Response,
): Promise<void> => {
  res.json({ hello: 'world' });
};

export const getTodos = async (
  req: RequestWithContext,
  res: Response,
): Promise<void> => {
  // Temporary escape hatch
  const runReadTodos = () =>
    pipe(
      T.service<TodoRepositoryDefinition>(TodoRepository),
      T.chain((service) => service.readMany()),
      T.provideSomeLayer(req.context.services),
      executeEffectWithPromise,
    );

  const todosResult = await runReadTodos();

  if (E.isLeft(todosResult)) {
    console.log(todosResult.left);
    res.sendStatus(500);
    return;
  }

  res.json(todosResult.right);
};
