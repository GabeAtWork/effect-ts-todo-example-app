import * as T from '@effect-ts/core/Effect';
import * as E from '@effect-ts/core/Either';

export async function executeEffectWithPromise<E, A>(
  effect: T.Effect<unknown, E, A>,
): Promise<E.Either<{ _tag: 'executionError'; result: unknown } | E, A>> {
  const result = await T.runPromiseExit(effect);

  if (result._tag === 'Success') {
    return E.right(result.value);
  }

  return E.left(
    result.cause._tag === 'Fail'
      ? result.cause.value
      : { _tag: 'executionError', result },
  );
}
