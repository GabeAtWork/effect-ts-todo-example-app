import React from 'react';
import { RemoteData as RD, useQuery } from '../../../../infrastructure';
import { getTodos } from '../../data-source';
import * as A from '@effect-ts/core/Collections/Immutable/Array';
import { pipe } from '@effect-ts/core';
import { Todo } from '../../todo';
import styles from './TodoList.module.scss';

export const TodoList = () => {
  const [todos, refetchTodos] = useQuery(() => getTodos(), []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.page}>
        <div className={styles.titleLine}>
          <h1 className={styles.pageTitle}>Your todo list</h1>{' '}
          <div>
            <button onClick={refetchTodos}>Fetch again</button>
          </div>
        </div>

        {RD.fold_(
          todos,
          () => (
            <div>Loading...</div>
          ),
          () => (
            <div>Loading...</div>
          ),
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
            <>
              {todos.length > 0 ? (
                <div className={styles.list}>
                  {pipe(
                    todos,
                    A.map((todo) => <TodoListItem todo={todo} />),
                  )}
                </div>
              ) : (
                <p>No todo to display</p>
              )}
            </>
          ),
        )}
      </div>
    </div>
  );
};

const TodoListItem = ({ todo }: { todo: Todo }) => {
  return (
    <div className={styles.listItem}>
      <div className={styles.listItemTitleLine}>
        <input type="checkbox" checked={todo.status === 'completed'} />{' '}
        <div className={styles.listItemTitle}>{todo.title}</div>
      </div>
      <div className={styles.listItemDescription}>{todo.description}</div>
    </div>
  );
};
