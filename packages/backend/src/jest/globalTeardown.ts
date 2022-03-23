/* eslint-disable no-console */

import { createPool, sql } from 'slonik';
import { TEST_DB_NAME } from './connection';

function getDatabaseServerConnection() {
  return createPool(
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`,
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

export default async () => {
  console.log(`Tearing down test db "${TEST_DB_NAME}".`);
  const connection = getDatabaseServerConnection();
  // Dropping all remaining connections
  await connection.query(sql`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = ${TEST_DB_NAME}
      AND pid <> pg_backend_pid();
  `);
  await connection.query(sql`DROP DATABASE ${sql.identifier([TEST_DB_NAME])}`);
  await connection.end();
  console.log('Done.');
};
