import { createPool } from 'slonik';

export const TEST_DB_NAME = 'example_todo_app_tests';
process.env.DB_DATABASE = TEST_DB_NAME;

export function getTestDatabaseConnection() {
  return createPool(
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${TEST_DB_NAME}`,
    {
      typeParsers: [
        {
          name: 'timestamptz',
          parse: (value: string | null) => {
            return value;
          },
        },
      ],
    },
  );
}
