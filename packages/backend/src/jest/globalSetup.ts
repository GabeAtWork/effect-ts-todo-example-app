/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
import { join } from 'path';
import { SlonikMigrator } from '@slonik/migrator';
import { createPool, sql } from 'slonik';
import { TEST_DB_NAME, getTestDatabaseConnection } from './connection';

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
  console.log(`\nSetting up test db "${TEST_DB_NAME}".`);
  const connection = getDatabaseServerConnection();
  const query = sql`CREATE DATABASE ${sql.identifier([
    TEST_DB_NAME,
  ])} WITH ENCODING 'UTF8'`;

  await connection.query(query);
  await connection.end();

  const connectionToTheTestDatabase = getTestDatabaseConnection();

  const migrator = new SlonikMigrator({
    migrationsPath: join(__dirname, '../database/migrations'),
    migrationTableName: 'migration',
    slonik: connectionToTheTestDatabase,
  } as any);
  await migrator.up();
  console.log('Done.');
};
