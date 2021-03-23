import type { Rect, Vector2 } from '@types';

export class Rectangle {
  public static intersects(a: Rect, b: Rect): boolean {
    return (
      Math.max(a.y1, b.y1) < Math.min(a.y2, b.y2) &&
      Math.max(a.x1, b.x1) < Math.min(a.x1, b.x2)
    );
  }

  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;

  public get w(): number {
    return Math.abs(this.x2 - this.x1);
  }

  public get h(): number {
    return Math.abs(this.y2 - this.y1);
  }

  public get cx(): number {
    return Math.floor((this.x1 + this.x2) / 2);
  }

  public get cy(): number {
    return Math.floor((this.y1 + this.y2) / 2);
  }

  public intersects(rect: Rect): boolean {
    return (
      Math.max(this.x1, rect.x1) < Math.min(this.x2, rect.x2) &&
      Math.max(this.y1, rect.y1) < Math.min(this.y2, rect.y2)
    );
  }

  public contains(point: Vector2): boolean {
    if (point.x >= this.x1 && point.x <= this.x2) {
      if (point.x >= this.y1 && point.y <= this.y2) {
        return true;
      }
    }
    return false;
  }

  public constructor(rect: Rect) {
    this.x1 = rect.x1;
    this.y1 = rect.y1;
    this.x2 = rect.x2;
    this.y2 = rect.y2;
  }
}
