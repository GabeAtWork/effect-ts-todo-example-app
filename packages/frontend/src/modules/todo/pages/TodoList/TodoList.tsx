import React from 'react';
import { RemoteData as RD, useQuery } from '../../../../infrastructure';
import { getTodos } from '../../data-source';

export const TodoList = () => {
  const [todos, refetchTodos] = useQuery(() => getTodos(), []);

  // TODO: make nicer
  return RD.fold_(
    todos,
    () => <div>Loading...</div>,
    () => <div>Loading...</div>,
    (err) => (
      <div>
        Error {err._tag}: {err.message}{' '}
        {JSON.stringify(
          err._tag === 'DecodeError' ? err.zodError : err.originalError,
        )}
        <br />
        <button onClick={refetchTodos}>Fetch me again</button>
      </div>
    ),
    (todos) => (
      <div>
        {todos.length > 0 ? (
          <ul>{todos.map((todo) => todo.title)}</ul>
        ) : (
          <p>No todo to display</p>
        )}
        <button onClick={refetchTodos}>Fetch me again</button>
      </div>
    ),
  );
};
