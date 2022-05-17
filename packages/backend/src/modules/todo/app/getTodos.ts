import { pipe } from '@effect-ts/core';
import * as T from '@effect-ts/core/Effect';
import * as L from '@effect-ts/core/Effect/Layer';
import { Has } from '@effect-ts/system/Has';
import * as E from '@effect-ts/core/Either';
import { Request, Response } from 'express';
import { executeEffectWithPromise } from '../../../util/promise';
import { TodoRepository, TodoRepositoryDefinition } from '../infrastructure';

// TODO refactor as an effect
export const getTodos =
  (context: L.Layer<unknown, never, Has<TodoRepositoryDefinition>>) =>
  async (req: Request, res: Response): Promise<void> => {
    // Temporary escape hatch
    const runReadTodos = () =>
      pipe(
        T.service<TodoRepositoryDefinition>(TodoRepository),
        T.chain((service) => service.readMany()),
        T.provideSomeLayer(context),
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
