import type { Vector2 } from '@types';
import { Direction } from '@enums';

export function isWithin(a: Vector2, points: Vector2[]): boolean {
  return points.some(p => p.x === a.x && p.y === a.y);
}

export function isSamePoint(a?: Vector2, b?: Vector2): boolean {
  return a && b ? a.x === b.x && a.y === b.y : false;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function add(...points: Vector2[]): Vector2 {
  let [x, y] = [0, 0];
  for (const point of points) {
    x += point.x;
    y += point.y;
  }
  return { x, y };
}

export function getInteractionPos(point: Vector2 & { d: Direction }): Vector2 {
  let { x, y } = point;
  switch (point.d) {
    case Direction.N:
    case Direction.NE:
    case Direction.NW:
      y -= 1;
      break;
    case Direction.S:
    case Direction.SE:
    case Direction.SW:
      y += 1;
      break;
  }
  switch (point.d) {
    case Direction.NW:
    case Direction.W:
    case Direction.SW:
      x -= 1;
      break;
    case Direction.NE:
    case Direction.E:
    case Direction.SE:
      x += 1;
      break;
  }
  return { x, y };
}

export const getNewDirection = (() => {
  const dirs: Record<string, Direction> = {
    '1,0': Direction.N,
    '2,1': Direction.E,
    '1,2': Direction.S,
    '0,1': Direction.W
  };
  return (point: Vector2): Direction | null => {
    const key = `${point.x + 1},${point.y + 1}`;
    return dirs[key] ?? null;
  };
})();

// order is, unfortunately, important here
export { Sprite as T } from './tiles';

export { roll } from './random';
export * as RNG from './random';

export * from './actions';
export * from './aoe';
export * from './constants';
export * from './decorators';
export * from './dialogue';
export * from './misc';
export * from './geometry';
