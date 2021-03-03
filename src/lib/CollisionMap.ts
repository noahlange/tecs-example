import type { Point, Size } from '@types';
import { Array2D } from './Array2D';

export class CollisionMap {
  protected collisions: Array2D<number>;
  protected obstructions: Array2D<number>;

  public readonly width: number;
  public readonly height: number;

  protected getIndex(point: Point): number {
    return point.x * this.height + point.y;
  }

  public set(
    point: Point,
    isPassable: boolean,
    allowLOS: boolean = isPassable
  ): void {
    this.collisions.set(point, isPassable ? 0 : 1);
    this.obstructions.set(point, allowLOS ? 0 : 1);
  }

  public isVisible(point: Point): boolean {
    return this.obstructions.get(point) !== 1;
  }

  public isPassable(point: Point): boolean {
    return this.collisions.get(point) !== 1;
  }

  public contains(point: Point): boolean {
    return point.x < this.width && point.y < this.height;
  }

  public get(point: Point): { blocksView: boolean; isPassable: boolean } {
    return {
      blocksView: this.isVisible(point),
      isPassable: this.isPassable(point)
    };
  }

  public constructor(size: Size) {
    this.width = size.w;
    this.height = size.h;
    this.collisions = new Array2D(size);
    this.obstructions = new Array2D(size);
  }
}
