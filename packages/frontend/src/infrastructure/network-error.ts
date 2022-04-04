import * as Case from '@effect-ts/core/Case';

export class NetworkError extends Case.Tagged('NetworkError')<{}> {
  public readonly message!: string;
  public readonly originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super();
    this.message = message;
    this.originalError = originalError;
  }
}
