import * as Q from '@effect-ts/query/Query';
import { pipe } from '@effect-ts/system/Function';
import * as T from '@effect-ts/core/Effect';

/**
 * Not sure why this needs to exists, but will execute queries one by one
 */
export class QueryExecutor {
  _pending: Q.Query<unknown, never, void>[] = [];

  constructor() {
    this.run = this.run.bind(this);
  }

  setImmediate(fn: () => void) {
    return typeof setImmediate === 'function'
      ? setImmediate(fn)
      : setTimeout(fn);
  }

  schedule(query: Q.Query<unknown, never, void>) {
    this._pending.push(query);
    if (this._pending.length === 1) this.setImmediate(this.run);
  }

  run() {
    const queries = this._pending.splice(0);

    return pipe(Q.collectAllPar(queries), Q.run, T.runPromise);
  }
}
