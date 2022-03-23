import { sql } from 'slonik';
import { v4 as uuidv4 } from 'uuid';
import { LiveTodoRepository } from '../repository';
import { getTestDatabaseConnection } from '../../../../../jest/connection';
import * as T from '@effect-ts/core/Effect';
import { pipe } from '@effect-ts/core';
import { getLiveDatabaseService } from '../../../../../infrastructure';
import { TodoRepository } from '../definition';
import { executeEffectWithPromise } from '../../../../../util/promise';
import * as E from '@effect-ts/core/Either';

const pool = getTestDatabaseConnection();

const databaseService = getLiveDatabaseService(pool);

const env = databaseService['>>>'](LiveTodoRepository);

// Get functions under test here
const { readMany } = T.deriveLifted(TodoRepository)(['readMany'], [], []);

describe('readMany()', () => {
  const runReadMany = () =>
    pipe(readMany(), T.provideSomeLayer(env), executeEffectWithPromise);

  beforeEach(async () => {
    await pool.any(sql`TRUNCATE TABLE todo_app.todo`);
  });

  describe('Given no todos in database', () => {
    it(`should return an empty array`, async () => {
      const result = await runReadMany();

      // TODO add expectLeft / expectRight

      expect(E.isRight(result) && result.right).toHaveLength(0);
    });
  });

  describe('Given some todos in database', () => {
    beforeEach(async () => {
      await generateTodo({
        title: 'Write repository',
      });

      await generateTodo({
        title: 'Publish lib',
      });
    });

    it('should return the todos', async () => {
      const result = await runReadMany();

      expect(E.isRight(result) && result.right).toHaveLength(2);
      expect(
        E.isRight(result) &&
          result.right.find(({ title }) => title === 'Write repository'),
      ).toMatchObject({
        title: 'Write repository',
        status: 'created',
      });
    });
  });
});

type RawTodo = {
  id: string;
  title: string;
  description: string;
  status: 'created' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};

const generateTodo = async (input: Partial<RawTodo>) => {
  const {
    id,
    title,
    description,
    status,
    createdAt,
    updatedAt,
    completedAt,
  }: RawTodo = {
    id: uuidv4(),
    title: 'Some todo',
    description: '',
    status: 'created',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...input,
  };

  await pool.any(
    sql`INSERT INTO todo_app.todo (id, title, description, status, created_at, updated_at, completed_at)
    VALUES (
      ${id},
      ${title},
      ${description},
      ${status},
      ${createdAt.toISOString()},
      ${updatedAt.toISOString()},
      ${completedAt ? completedAt.toISOString() : null}
    )`,
  );
};
