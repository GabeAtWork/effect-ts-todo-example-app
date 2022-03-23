export class BaseError<T extends {} = {}> extends Error {
  public data?: T;

  constructor(message: string, data?: T) {
    super(message);
    this.data = data;
  }
}
