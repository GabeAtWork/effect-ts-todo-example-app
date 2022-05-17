import * as L from '@effect-ts/core/Effect/Layer';
import { Has } from '@effect-ts/system/Has';
import { ControllerDefinition } from '../../../types';
import { TodoRepositoryDefinition } from '../infrastructure';
import { getTodos } from './getTodos';

export function buildTodoController(
  context: L.Layer<unknown, never, Has<TodoRepositoryDefinition>>,
): ControllerDefinition {
  return [
    {
      path: '/api/todos',
      method: 'get',
      handler: getTodos(context),
    },
  ];
}
