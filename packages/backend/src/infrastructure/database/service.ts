import * as T from '@effect-ts/core/Effect';
import * as L from '@effect-ts/core/Effect/Layer';
import { Has, tag } from '@effect-ts/system/Has';
import { DatabasePoolType } from 'slonik';
import {
  ConnectionRoutineType,
  TransactionFunctionType,
} from 'slonik/dist/src/types';
import { DatabaseError } from './error';

/* eslint-disable @typescript-eslint/naming-convention */

export const DatabaseServiceId = Symbol.for('DatabaseService');
export type DatabaseServiceIdType = typeof DatabaseServiceId;

// ************* Definition ************

export interface DatabaseServiceDefinition {
  // Dependencies are unknown because the service we want to use is prepackaged
  runInConnection: <X, E = DatabaseError>(
    f: ConnectionRoutineType<X>,
    onReject: OnRejectFn<E>,
  ) => T.Effect<unknown, E, X>;
  runInTransaction: <X, E = DatabaseError>(
    f: TransactionFunctionType<X>,
    onReject: OnRejectFn<E>,
  ) => T.Effect<unknown, E, X>;
}

/**
 * Use to define and access the service
 */
export const DatabaseService =
  tag<DatabaseServiceDefinition>(DatabaseServiceId);

/**
 * A function to interpret the error. E should be an object with a _tag property,
 * so that they're easily discriminated if used in unions
 */
type OnRejectFn<E = DatabaseError> = (error: unknown) => E;

// ************* Layer ************

const getMakeDatabaseService = (
  pool: DatabasePoolType,
): T.Effect<unknown, never, DatabaseServiceDefinition> => {
  const runInConnection: DatabaseServiceDefinition['runInConnection'] = (
    f,
    onReject,
  ) => T.tryCatchPromise(async () => pool.connect(f), onReject);

  const runInTransaction: DatabaseServiceDefinition['runInTransaction'] = (
    f,
    onReject,
  ) => T.tryCatchPromise(async () => pool.transaction(f), onReject);

  return T.succeed({
    runInConnection,
    runInTransaction,
  });
};

export const getLiveDatabaseService = (
  pool: DatabasePoolType,
): L.Layer<unknown, never, Has<DatabaseServiceDefinition>> =>
  L.fromEffect(DatabaseService)(getMakeDatabaseService(pool));
