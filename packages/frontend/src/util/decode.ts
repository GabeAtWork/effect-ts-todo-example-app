import * as Case from '@effect-ts/core/Case';
import * as E from '@effect-ts/core/Either';
import * as T from '@effect-ts/core/Effect';
import * as z from 'zod';
import { pipe } from '@effect-ts/core';

export class DecodeError extends Case.Tagged('DecodeError')<{}> {
  public readonly message!: string;
  public readonly payload: unknown;
  public readonly zodError!: z.ZodError;

  constructor(message: string, payload: unknown, zodError: z.ZodError) {
    super();
    this.message = message;
    this.payload = payload;
    this.zodError = zodError;
  }
}

export const decodeToEither =
  <T>(schema: z.Schema<T>) =>
  (rawData: unknown): E.Either<DecodeError, T> =>
    pipe(schema.safeParse(rawData), (result) =>
      result.success
        ? E.right(result.data)
        : E.left(new DecodeError('Decode error', rawData, result.error)),
    );

export const decodeToEffect =
  <T>(schema: z.Schema<T>) =>
  (rawData: unknown): T.Effect<unknown, DecodeError, T> =>
    pipe(rawData, decodeToEither(schema), (result) =>
      T.fromEither(() => result),
    );

// ************* Decode utils ************
export const dateSchema = z.preprocess(
  (date) => (typeof date === 'string' ? new Date(date) : date),
  z.date(),
);
