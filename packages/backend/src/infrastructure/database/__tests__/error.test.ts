import * as z from 'zod';
import { decodeFromSchema } from '../error';
import * as E from '@effect-ts/core/Either';

describe('decodeFromSchema()', () => {
  const exampleSchema = z.object({
    id: z.string(),
  });

  const decode = decodeFromSchema(exampleSchema);

  describe('Given an invalid value', () => {
    const value = 'one';

    it('should return an error', () => {
      expect(E.isLeft(decode(value))).toBeTruthy();
    });
  });

  describe('Given a valid value', () => {
    const value = { id: '1234' };

    it('should return an error', () => {
      expect(E.isLeft(decode(value))).toBeFalsy();
    });
  });
});
