import * as z from 'zod';
import * as E from '@effect-ts/core/Either';
import { BaseError } from '../../util/error';
import { pipe } from '@effect-ts/core';

export type DatabaseError = {
  _tag: 'databaseError';
  error: BaseError;
};

/**
 * Constructor to easily make a DatabaseError from an error of type `unknown`
 */
export const toDatabaseError =
  (data?: Record<string, unknown>) =>
  (error: unknown): DatabaseError => ({
    _tag: 'databaseError',
    // TODO wrap error if of type Error
    error: new BaseError('Database error', { error, data }),
  });

/**
 * Error when parsing the database output
 */
export type DatabaseDecodeError = {
  _tag: 'databaseDecodeError';
  error: z.ZodError<unknown>;
};

const toDatabaseDecodeError = (
  zodError: z.ZodError<unknown>,
): DatabaseDecodeError => ({
  _tag: 'databaseDecodeError',
  error: zodError,
});

export const decodeFromSchema =
  <T>(schema: z.ZodSchema<T>) =>
  (value: unknown): E.Either<DatabaseDecodeError, T> =>
    pipe(schema.safeParse(value), (zodResult) =>
      zodResult.success
        ? E.right(zodResult.data)
        : E.left(toDatabaseDecodeError(zodResult.error)),
    );
