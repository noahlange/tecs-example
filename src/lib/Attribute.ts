export class Attribute {
  public base: number = 5;
  public modifiers: number[] = [];

  public get value(): number {
    return this.base;
  }
}
