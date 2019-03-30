export class Fault<T extends object> {
  public message: string;
  public data?: T;
  public level: number;
  public stack?: string;

  constructor(message: string, data?: T, level: number = 0) {
    this.message = message;
    this.data = data;
    this.level = level;
    this.stack = new Error().stack;
  }
}
