import { sql } from 'slonik';
import * as T from '@effect-ts/core/Effect';
import * as E from '@effect-ts/core/Either';
import * as A from '@effect-ts/core/Collections/Immutable/Array';
import { Has } from '@effect-ts/system/Has';
import * as L from '@effect-ts/core/Effect/Layer';
import { pipe } from '@effect-ts/core';
import {
  TodoRepository,
  TodoRepositoryDefinition,
  toTodoNotFoundError,
} from './definition';
import {
  DatabaseService,
  DatabaseServiceDefinition,
  toDatabaseError,
} from '../../../../infrastructure';
import { todoIdSchema } from '../../domain';
import * as z from 'zod';
import { decodeFromSchema } from '../../../../infrastructure/database';
import { flow } from '@effect-ts/system/Function';

/**
 * Wires the dependencies to the repository when called with a layer
 */
const makeTodoRepository = pipe(
  T.accessServices({ databaseService: DatabaseService })((_) => _),
  T.map(buildTodoRepository),
);

/**
 * The actually usable service as a layer
 */
export const LiveTodoRepository: L.Layer<
  Has<DatabaseServiceDefinition>,
  never,
  Has<TodoRepositoryDefinition>
> = L.fromEffect(TodoRepository)(makeTodoRepository);

/**
 * Builds the repository with its dependencies
 */
function buildTodoRepository({
  databaseService: { runInConnection },
}: {
  databaseService: DatabaseServiceDefinition;
}): TodoRepositoryDefinition {
  const readMany: TodoRepositoryDefinition['readMany'] = () =>
    pipe(
      runInConnection(
        async (connection) => connection.any(sql`SELECT * FROM todo_app.todo;`),
        toDatabaseError(),
      ),
      // Decode
      T.map(flow(A.map(decodeTodo), A.sequence(E.Applicative))),
      // Lift into Effect
      // TODO find out how to simplify this
      T.chain((value) => T.fromEither(() => value)),
    );

  const create: TodoRepositoryDefinition['create'] = (initialTodo) =>
    pipe(
      runInConnection(
        async (connection) =>
          connection.one(sql`
        INSERT INTO todo_app.todo (id, status, title, description, created_at, updated_at)
        VALUES (UUID(), 'created', ${initialTodo.title}, ${initialTodo.description}, NOW(), NOW())
        RETURNING *
      `),
        toDatabaseError({ initialTodo }),
      ),
      // Decode
      T.map(decodeTodo),
      // Lift into Effect
      T.chain((value) => T.fromEither(() => value)),
    );

  const update: TodoRepositoryDefinition['update'] = (todoUpdate) =>
    pipe(
      runInConnection(
        async (connection) =>
          connection.maybeOne(sql`
      UPDATE todo_app.todo
        SET title = ${todoUpdate.title},
            description = ${todoUpdate.description}
      WHERE id = ${todoUpdate.id}
      RETURNING *
    `),
        toDatabaseError({ todoUpdate }),
      ),
      // Handle empty result case
      T.chain((result) =>
        T.fromEither(() =>
          result ? E.right(result) : E.left(toTodoNotFoundError()),
        ),
      ),
      // Decode
      T.map(decodeTodo),
      // Lift into Effect
      T.chain((value) => T.fromEither(() => value)),
    );

  const markAsCompleted: TodoRepositoryDefinition['markAsCompleted'] = (id) =>
    pipe(
      runInConnection(
        async (connection) =>
          connection.maybeOne(sql`
      UPDATE todo_app.todo
        SET status = 'completed',
            completed_at = NOW(),
            updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `),
        toDatabaseError({ id }),
      ),
      // Handle empty result case
      T.chain((result) =>
        T.fromEither(() =>
          result ? E.right(result) : E.left(toTodoNotFoundError()),
        ),
      ),
      // Decode
      T.map(decodeTodo),
      // Lift into Effect
      T.chain((value) => T.fromEither(() => value)),
    );

  return {
    readMany,
    create,
    update,
    markAsCompleted,
  };
}

const baseTodoSchema = z.object({
  id: todoIdSchema,
  title: z.string(),
  description: z.string(),
  created_at: z.string(),
});

const todoSchema = z.union([
  z.intersection(baseTodoSchema, z.object({ status: z.literal('created') })),
  z.intersection(
    baseTodoSchema,
    z.object({ status: z.literal('completed'), completed_at: z.string() }),
  ),
]);

const decodeTodo = flow(
  decodeFromSchema(todoSchema),
  E.map((todo) =>
    todo.status === 'created'
      ? {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          status: todo.status,
          createdAt: new Date(todo.created_at),
        }
      : {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          status: todo.status,
          createdAt: new Date(todo.created_at),
          completedAt: new Date(todo.completed_at),
        },
  ),
);
