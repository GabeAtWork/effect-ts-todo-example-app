import { NonEmptyArray as NEA } from '@effect-ts/core';
import { Request, Response, NextFunction } from 'express';

// TODO change this to use effects maybe?
export type RouteHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export type RouteDefinition = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  handler: RouteHandlerFn;
};

// TODO improve to make it impossible to declare several times the same route + method
export type ControllerDefinition = NEA.NonEmptyArray<RouteDefinition>;
