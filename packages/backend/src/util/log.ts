export const logAndPass =
  (message: string) =>
  <T>(value: T): T => {
    console.log(message, value);
    return value;
  };
