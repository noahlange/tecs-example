import type { Rect, Vector2 } from './types';

import { intersects } from '@utils/geometry';

export class Rectangle {
  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;

  public get width(): number {
    return Math.abs(this.x2 - this.x1);
  }

  public get height(): number {
    return Math.abs(this.y2 - this.y1);
  }

  public get center(): Vector2 {
    return {
      x: Math.floor((this.x1 + this.x2) / 2),
      y: Math.floor((this.y1 + this.y2) / 2)
    };
  }

  public intersects(rect: Rect): boolean {
    return intersects(this, rect);
  }

  public contains(point: Vector2): boolean {
    return (
      point.x >= this.x1 &&
      point.x <= this.x2 &&
      point.y >= this.y1 &&
      point.y <= this.y2
    );
  }

  public constructor(rect: Rect) {
    this.x1 = rect.x1;
    this.y1 = rect.y1;
    this.x2 = rect.x2;
    this.y2 = rect.y2;
  }
}
