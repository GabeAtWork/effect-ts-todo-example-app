import * as express from 'express';
import { MainEnv } from './services';

export type RequestWithContext = express.Request & {
  context: { services: MainEnv };
};
