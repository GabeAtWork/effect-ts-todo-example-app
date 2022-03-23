import * as Branded from '@effect-ts/core/Branded';
import * as E from '@effect-ts/core/Either';
import * as z from 'zod';

export type TodoId = Branded.Branded<string, 'TodoId'>;

export const todoIdSchema: z.Schema<TodoId> = z
  .any()
  .refine((value) => z.string().safeParse(value).success);

export type Todo = {
  id: TodoId;
  title: string;
  description: string;
  createdAt: Date;
} & (
  | {
      status: 'created';
    }
  | {
      status: 'completed';
      completedAt: Date;
    }
);

// ************* Updating ************

export type InitialTodo = {
  title: string;
  description: string;
};

export type ValidatedInitialTodo = Branded.Branded<InitialTodo, 'InitialTodo'>;

/**
 * Validates an initial todo according to its invariants:
 * - Title must not be empty
 *
 * TODO: put validation functions in one place
 */
export function validateInitialTodo(
  initialTodo: InitialTodo,
): E.Either<ValidationError, ValidatedInitialTodo> {
  if (isTitleValid(initialTodo.title)) {
    return E.left({ _tag: 'validationError', error: 'Title is empty' });
  }

  return E.right(initialTodo as ValidatedInitialTodo);
}

export type TodoUpdate = {
  id: TodoId;
  title: string;
  description: string;
};

export type ValidatedTodoUpdate = Branded.Branded<TodoUpdate, 'TodoUpdate'>;

/**
 * Validates an initial todo according to its invariants:
 * - Title must not be empty
 *
 * TODO: put validation functions in one place
 */
export function validateTodoUpdate(
  update: TodoUpdate,
): E.Either<ValidationError, ValidatedTodoUpdate> {
  if (isTitleValid(update.title)) {
    return E.left({ _tag: 'validationError', error: 'Title is empty' });
  }

  return E.right(update as ValidatedTodoUpdate);
}

const isTitleValid = (title: string): boolean => title.length !== 0;

// ************* Error ************

export type ValidationError = {
  _tag: 'validationError';
  // TODO improve with logic
  error: unknown;
};
