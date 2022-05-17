/* eslint-disable max-classes-per-file */
import * as Case from '@effect-ts/core/Case';

/**
 * Represents the state of data that needs to be fetched from a remote source
 */
export type RemoteData<E, A> = Initial | Pending | Success<A> | Failure<E>;

class Initial extends Case.Tagged('Initial')<{}> {}
export const initial: RemoteData<never, never> = new Initial();

class Pending extends Case.Tagged('Pending')<{}> {}
export const pending: RemoteData<never, never> = new Pending();

class Success<A> extends Case.Tagged('Success')<{
  readonly value: A;
}> {}
export function success<A>(value: A): RemoteData<never, A> {
  return new Success({ value });
}

class Failure<E> extends Case.Tagged('Failure')<{
  readonly error: E;
}> {}
export function failure<E>(error: E): RemoteData<E, never> {
  return new Failure({ error });
}

export function fold_<E, A, B>(
  fa: RemoteData<E, A>,
  onInit: () => B,
  onPending: () => B,
  onError: (e: E) => B,
  onData: (data: A) => B,
) {
  switch (fa._tag) {
    case 'Initial':
      return onInit();
    case 'Pending':
      return onPending();
    case 'Failure':
      return onError(fa.error);
    case 'Success':
      return onData(fa.value);
  }
}
