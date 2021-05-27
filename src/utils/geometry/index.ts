import type { Rect } from '@lib/types';
import type { Vector2 } from 'malwoden';

export function intersects(a: Rect, b: Rect): boolean {
  return (
    Math.max(a.x1, b.x1) < Math.min(a.x2, b.x2) &&
    Math.max(a.y1, b.y1) < Math.min(a.y2, b.y2)
  );
}

export function distance(a: Vector2, b: Vector2): number {
  return Math.sqrt((b.x - a.x) ** 2) + Math.sqrt((b.y - a.y) ** 2);
}

export * from './aoe';
export * from './iterators';
export * from './vectors';
export * from './directions';
