import * as T from '@effect-ts/core/Effect';
import { NetworkError } from './network-error';

export const fetchJsonAsEffect = (
  requestInfo: RequestInfo,
  requestInit?: RequestInit | undefined,
): T.Effect<unknown, NetworkError, unknown> =>
  T.tryCatchPromise(
    () =>
      fetch(requestInfo, requestInit).then(
        (res) => res.json() as Promise<unknown>,
      ),
    (error) => new NetworkError('An unknown error happened', error),
  );
