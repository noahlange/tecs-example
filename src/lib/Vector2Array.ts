import type { Vector2, Size } from '@types';

export class Vector2Array<T> {
  public static from<T>(items: [Vector2, T][]): Vector2Array<T> {
    const width = Math.max(...items.map(([pos]) => pos.x)) + 1;
    const height = Math.max(...items.map(([pos]) => pos.y)) + 1;
    const arr = new Vector2Array<T>({ width, height });
    for (const [point, value] of items) {
      arr.set(point, value);
    }
    return arr;
  }

  protected items: T[];

  public readonly width: number;
  public readonly height: number;

  protected getIndex(point: Vector2): number {
    return point.x * this.height + point.y;
  }

  protected getPoint(index: number): Vector2 {
    const x = Math.floor(index / this.height);
    const y = index - x * this.height;
    return { x, y };
  }

  public is(point: Vector2, value: T): boolean {
    const index = this.getIndex(point);
    return this.items[index] === value;
  }

  public has(point: Vector2): boolean {
    const i = this.getIndex(point);
    return !!this.items[i];
  }

  public delete(point: Vector2): void {
    const i = this.getIndex(point);
    delete this.items[i];
  }

  public get(point: Vector2): T {
    return this.items[this.getIndex(point)];
  }

  public set(point: Vector2, value: T): void {
    const i = this.getIndex(point);
    this.items[i] = value;
  }

  public clear(): void {
    this.items = new Array(this.width * this.height);
  }

  public fill(value: T): void {
    this.items.fill(value);
  }

  public clone(): Vector2Array<T> {
    const res = new Vector2Array<T>({ width: this.width, height: this.height });
    res.items = this.items.slice();
    return res;
  }

  public *keys(): Iterable<Vector2> {
    for (const [point] of this.entries()) {
      yield point;
    }
  }

  public *values(): Iterable<T> {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }

  public *entries(): Iterable<[Vector2, T]> {
    const count = this.width * this.height;
    for (let i = 0; i < count; i++) {
      const v = this.items[i];
      if (v !== undefined) {
        yield [this.getPoint(i), v];
      }
    }
  }

  public toString(): string {
    let str = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        str += this.get({ x, y }) ?? ' ';
      }
      str += '\n';
    }
    return str;
  }

  public constructor(size: Size, fill: T | null = null) {
    this.width = size.width;
    this.height = size.height;
    this.items = new Array(this.width * this.height);
    if (fill !== null) {
      this.fill(fill);
    }
  }
}
