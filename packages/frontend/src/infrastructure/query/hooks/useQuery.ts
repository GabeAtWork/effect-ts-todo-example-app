import * as Q from '@effect-ts/query/Query';
import * as T from '@effect-ts/core/Effect';
import * as RD from '../remote-data';
import * as React from 'react';
import { tuple } from '@effect-ts/system/Function';
import * as QX from '../query-executor';
import { pipe } from '@effect-ts/core/Function';

const QueryExecutorContext = React.createContext(new QX.QueryExecutor());

export type RefetchFn = () => void;

/**
 * Allows to execute a query via a hook
 */
export function useQuery<E, A>(
  lazyQuery: () => Q.Query<unknown, E, A>,
  deps: unknown[],
): readonly [RD.RemoteData<E, A>, RefetchFn] {
  const queryExecutor = React.useContext(QueryExecutorContext);
  const [currentValue, setCurrentValue] = React.useState<RD.RemoteData<E, A>>(
    RD.initial,
  );
  const [refetchIdx, setRefetchIdx] = React.useState(0);
  const refetch = React.useCallback(
    () => setRefetchIdx((idx) => idx + 1),
    [setRefetchIdx],
  );

  const query = React.useMemo(
    () =>
      pipe(
        Q.fromEffect(T.succeedWith(() => setCurrentValue(RD.pending))),
        Q.chain(lazyQuery),
        Q.foldM(
          (error) => {
            console.log(error);
            return Q.fromEffect(
              T.succeedWith(() => setCurrentValue(RD.failure(error))),
            );
          },
          (value) =>
            Q.fromEffect(
              T.succeedWith(() => setCurrentValue(RD.success(value))),
            ),
        ),
      ),
    deps,
  );

  React.useEffect(
    () => queryExecutor.schedule(query),
    [queryExecutor, query, refetchIdx],
  );

  return tuple(currentValue, refetch);
}
