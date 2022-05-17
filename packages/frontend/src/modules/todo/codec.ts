import * as z from 'zod';
import { dateSchema } from '../../util/decode';

export const todoSchema = z.intersection(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    createdAt: dateSchema,
  }),
  z.union([
    z.object({
      status: z.literal('created'),
    }),
    z.object({
      status: z.literal('completed'),
      completedAt: dateSchema,
    }),
  ]),
);
