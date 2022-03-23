import * as T from '@effect-ts/core/Effect';
import { tag } from '@effect-ts/system/Has';
import { DatabaseError, DatabaseDecodeError } from '../../../../infrastructure';
import { Todo } from '../../domain';
import {
  TodoId,
  ValidatedInitialTodo,
  ValidatedTodoUpdate,
} from '../../domain';
import * as A from '@effect-ts/core/Collections/Immutable/Array';

/**
 * The repository methods, without effect dependencies (they will be provided
 * at the layer level)
 */
export type TodoRepositoryDefinition = {
  readMany: () => T.Effect<
    unknown,
    DatabaseError | DatabaseDecodeError,
    A.Array<Todo>
  >;
  create: (
    initialTodo: ValidatedInitialTodo,
  ) => T.Effect<unknown, DatabaseError | DatabaseDecodeError, Todo>;
  update: (
    update: ValidatedTodoUpdate,
  ) => T.Effect<
    unknown,
    DatabaseError | DatabaseDecodeError | TodoNotFoundError,
    Todo
  >;
  markAsCompleted: (
    id: TodoId,
  ) => T.Effect<
    unknown,
    DatabaseError | DatabaseDecodeError | TodoNotFoundError,
    Todo
  >;
};

export const TodoRepository = tag<TodoRepositoryDefinition>();

// ************* Errors ************

export type TodoNotFoundError = { _tag: 'todoNotFound' };

export const toTodoNotFoundError = (): TodoNotFoundError => ({
  _tag: 'todoNotFound',
});
