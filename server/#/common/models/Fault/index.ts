export type FaultArguments<T> = Parameters<
  (message: string, data?: T, level?: number) => void
>;

export class Fault<T extends object = any> {
  public message: string;
  public data?: T;
  public level: number;
  public stack?: string;

  constructor(...args: FaultArguments<T>) {
    this.message = args[0];
    this.data = args[1];
    this.level = args[2] || 0;
    this.stack = new Error().stack;
  }
}
