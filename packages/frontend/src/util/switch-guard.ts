export function switchGuard(value: never): never {
  throw new Error('Unexpected value', value);
}
