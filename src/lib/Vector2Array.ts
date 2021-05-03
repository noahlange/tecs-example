import type { Size, Vector2 } from './types';

import { iterateGrid } from '@utils/geometry';

export class Vector2Array<T> {
  public static from<T>(items: [Vector2, T][]): Vector2Array<T> {
    const { x, y } = items.reduce(
      (a: { x: number[]; y: number[] }, [point]) => {
        a.x.push(point.x);
        a.y.push(point.y);
        return a;
      },
      { x: [0], y: [0] }
    );

    const [minX, maxX] = [Math.min(...x), Math.max(...x)];
    const [minY, maxY] = [Math.min(...y), Math.max(...y)];

    const res = new Vector2Array<T>({
      width: 1 + (maxX - minX),
      height: 1 + (maxY - minY)
    });

    for (const [point, item] of items) {
      res.set(point, item);
    }

    return res;
  }

  protected items: T[];
  protected filler: T | null = null;
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

  public get(point: Vector2): T | undefined;
  public get(point: Vector2, defaultValue: T | (() => T)): T;
  /**
   * Return the contents of { x, y } or `defaultValue` if no contents exist.
   * If defaultValue is a function (usually for an expensive operation that
   * shouldn't be invoked inline), return its return value—otherwise return
   * the value itself.
   */
  public get(point: Vector2, defaultValue?: T | (() => T)): T | undefined {
    return (
      this.items[this.getIndex(point)] ??
      (typeof defaultValue === 'function'
        ? (defaultValue as () => T)()
        : defaultValue)
    );
  }

  public set(point: Vector2, value: T): void {
    const i = this.getIndex(point);
    this.items[i] = value;
  }

  public clear(): void {
    this.items = new Array(this.width * this.height);
  }

  public fill(value: T): void {
    this.filler = value;
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

  public toJSON(): { width: number; height: number; entries: [Vector2, T][] } {
    return {
      width: this.width,
      height: this.height,
      entries: Array.from(this.entries())
    };
  }

  public toString(): string {
    let str = '';
    for (const point of iterateGrid(this)) {
      str += this.get(point) ?? ' ';
      if (point.x === this.width) {
        str += '\n';
      }
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
