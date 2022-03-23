/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { SlonikMigrator } = require('@slonik/migrator');
const { createPool } = require('slonik');

const slonik = createPool(
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  {
    typeParsers: [
      // Disable casting ISO strings to milliseconds which is the default
      // behaviour in slonik. We don't want dates either which is the default
      // behaviour in node-pg.
      {
        name: 'timestamptz',
        parse: (value) => {
          return value;
        },
      },
    ],
  },
);

const migrator = new SlonikMigrator({
  migrationsPath: `${__dirname}/migrations`,
  migrationTableName: 'migration',
  slonik,
});

migrator.runAsCLI();
