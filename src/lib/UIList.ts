const orZero = (n: number): number => Math.max(0, isNaN(n) ? 0 : n);

export class UIList<T> {
  public items: T[];
  public index: number = 0;

  public get selected(): T {
    return this.items[this.index];
  }

  public get size(): number {
    return this.items.length;
  }

  public up(): void {
    this.index = orZero(
      this.index === 0 ? this.items.length - 1 : this.index - 1
    );
  }

  public down(): void {
    this.index = orZero((this.index + 1) % this.items.length);
  }

  public setItems(items: T[]): void {
    this.items = items;
    this.index = orZero(Math.min(this.index, items.length - 1));
  }

  public constructor(items: T[] = []) {
    this.items = items;
  }
}
