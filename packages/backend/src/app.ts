import express from 'express';
import logger from 'morgan';
import * as path from 'path';
import cors from 'cors';
import { bootstrapServices } from './services';
import { errorHandler, errorNotFoundHandler } from './middlewares/errorHandler';
import { bootstrapRoutes } from './routes';

// Create Express server
export const app = express();

import { createPool } from 'slonik';

app.use(cors());
app.options('*', cors() as any);
app.use(express.json());

// Express configuration
app.set('port', process.env.PORT || 8000);

app.use(logger('dev'));

const pool = createPool(
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
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

app.use(express.static(path.join(__dirname, '../public')));

const services = bootstrapServices({ pool });
bootstrapRoutes(app, services);

app.use(errorNotFoundHandler);
app.use(errorHandler);
