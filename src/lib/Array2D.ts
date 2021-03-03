import type { Point, Size } from '@types';

export class Array2D<T> {
  protected items: T[];
  protected indices: Map<number, Point> = new Map();

  public readonly width: number;
  public readonly height: number;

  protected getPoint(index: number): Point {
    if (!this.indices.has(index)) {
      const x = Math.floor(index / this.height);
      const point = { x, y: index - x * this.height };
      this.indices.set(index, point);
    }
    return this.indices.get(index)!;
  }

  protected getIndex(point: Point): number {
    return point.x * this.height + point.y;
  }

  public set(point: Point, value: T): void {
    const i = this.getIndex(point);
    this.items[i] = value;
    this.indices.set(i, point);
  }

  public delete(point: Point): void {
    const i = this.getIndex(point);
    delete this.items[i];
    this.indices.delete(i);
  }

  public get(point: Point): T {
    return this.items[this.getIndex(point)];
  }

  public clear(): void {
    this.items = new Array(this.width * this.height);
    this.indices.clear();
  }

  public fill(value: T): void {
    this.items.fill(value);
  }

  public *entries(): Iterable<[Point, T]> {
    for (const [index, point] of this.indices.entries()) {
      yield [point, this.items[index]];
    }
  }

  public constructor(size: Size, fill?: T) {
    this.items = new Array(size.w * size.h);
    this.width = size.w;
    this.height = size.h;
    if (fill) {
      this.fill(fill);
    }
  }
}
