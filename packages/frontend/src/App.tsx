import * as React from 'react';
import * as R from '@effect-ts/react';
import { _ROut } from '@effect-ts/system/Effect';
import * as T from '@effect-ts/core/Effect';
import * as L from '@effect-ts/core/Effect/Layer';
import { TodoList } from './modules';

type _GetROut<A> = [A] extends [{ [_ROut]: () => infer B }] ? B : never;

const LiveLayer = L.succeed(T.defaultEnv);

const RU = R.makeApp<_GetROut<typeof LiveLayer>>();

export default function App() {
  return (
    <RU.Provide layer={LiveLayer} sources={[]}>
      <TodoList />
    </RU.Provide>
  );
}
