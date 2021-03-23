import type { Vector2, Size } from '@types';

export class Vector2Array<T> {
  protected items: T[];

  public readonly width: number;
  public readonly height: number;

  public clone(): Vector2Array<T> {
    const res = new Vector2Array<T>({ w: this.width, h: this.height });
    res.items = this.items.slice();
    return res;
  }

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

  public set(point: Vector2, value: T): void {
    const i = this.getIndex(point);
    this.items[i] = value;
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

  public clear(): void {
    this.items = new Array(this.width * this.height);
  }

  public fill(value: T): void {
    this.items.fill(value);
  }

  public *keys(): Iterable<Vector2> {
    for (const [point] of this.entries()) {
      yield point;
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

  public constructor(size: Size, fill: T | null = null) {
    this.width = size.w;
    this.height = size.h;
    this.items = new Array(this.width * this.height);
    if (fill !== null) {
      this.fill(fill);
    }
  }
}
