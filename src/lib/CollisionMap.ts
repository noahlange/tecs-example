import type { Vector2, Size } from '@types';
import { Vector2Array } from './Vector2Array';

export interface CollisionMethods {
  isPassable(point: Vector2): boolean;
  isVisible(point: Vector2): boolean;
  set(point: Vector2, allowLOS: boolean, isPassable: boolean): void;
}

const BLOCKED = 1;
const CLEARED = 0;

export class CollisionMap implements CollisionMethods {
  protected obstacles: Vector2Array<number>;
  protected obstructions: Vector2Array<number>;

  public readonly width: number;
  public readonly height: number;

  protected getIndex(point: Vector2): number {
    return point.x * this.height + point.y;
  }

  public set(
    point: Vector2,
    isPassable: boolean,
    allowLOS: boolean = isPassable
  ): void {
    this.obstacles.set(point, isPassable ? CLEARED : BLOCKED);
    this.obstructions.set(point, allowLOS ? CLEARED : BLOCKED);
  }

  public isVisible(point: Vector2): boolean {
    return this.obstructions.is(point, CLEARED);
  }

  public isPassable(point: Vector2): boolean {
    return this.obstacles.is(point, CLEARED);
  }

  public contains(point: Vector2): boolean {
    return point.x < this.width && point.y < this.height;
  }

  public get(point: Vector2): { blocksView: boolean; isPassable: boolean } {
    return {
      blocksView: !this.isVisible(point),
      isPassable: this.isPassable(point)
    };
  }

  public constructor(size: Size) {
    this.width = size.width;
    this.height = size.height;
    this.obstacles = new Vector2Array(size);
    this.obstructions = new Vector2Array(size);
  }
}
