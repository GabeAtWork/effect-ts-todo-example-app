/* eslint-disable max-classes-per-file */
import * as DS from '@effect-ts/query/DataSource';
import * as Q from '@effect-ts/query/Query';
import * as RQ from '@effect-ts/query/Request';
import * as C from '@effect-ts/core/Collections/Immutable/Chunk';
import * as A from '@effect-ts/core/Collections/Immutable/Array';
import * as T from '@effect-ts/core/Effect';
import * as CRM from '@effect-ts/query/CompletedRequestMap';
import * as E from '@effect-ts/core/Either';
import { pipe } from '@effect-ts/core/Function';
import * as z from 'zod';
import { Todo } from './todo';
import { switchGuard } from '../../util/switch-guard';
import { apiUrl, fetchJsonAsEffect, NetworkError } from '../../infrastructure';
import { todoSchema } from './codec';
import { DecodeError, decodeToEffect } from '../../util/decode';

// Queries
class GetTodos extends RQ.StandardRequest<
  {},
  NetworkError | DecodeError,
  A.Array<Todo>
> {
  public readonly _tag = 'GetTodos';
}

// Extend with more Todo related requests
type TodoRequest = GetTodos;

// data source
export const TodoDataSource = DS.makeBatched('TodoDataSource')(
  (requests: C.Chunk<TodoRequest>) => {
    // TODO: optimise (dedup requests)
    return pipe(
      requests,
      // TODO: revisit matching/execution strategy
      C.map((req) => {
        switch (req._tag) {
          case 'GetTodos':
            return pipe(
              // Fetch
              fetchJsonAsEffect(`${apiUrl}/todos`),
              // Decode
              T.chain((rawData) =>
                pipe(rawData, decodeToEffect(z.array(todoSchema))),
              ),
              // Wrap with request
              T.map((success) => ({ req, result: E.right(success) })),
              T.catchAll((failure) =>
                T.succeed({ req, result: E.left(failure) }),
              ),
            );
          default:
            return switchGuard(req._tag);
        }
      }),
      // Inverting Chunk and Effect
      T.forEach((value) => value),
      // Match each request with its result (via a CRM)
      T.map(
        C.reduce(CRM.empty, (crm, { req, result }) => {
          switch (req._tag) {
            case 'GetTodos':
              return CRM.insert_(crm, req, result);
            default:
              return switchGuard(req._tag);
          }
        }),
      ),
    );
  },
);

// ************* Queries ************

/**
 * Fetches a list of Todos
 * TODO: Support query parameters
 */
export const getTodos = () =>
  pipe(
    Q.fromRequest(new GetTodos(), TodoDataSource),
    Q.provide('defaultEnv', T.defaultEnv),
  );
