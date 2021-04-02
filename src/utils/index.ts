import type { Vector2 } from '@types';
import { Vector2Array } from '@lib';
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
  const dirs = new Vector2Array<Direction>({ width: 3, height: 3 });
  dirs.set({ x: 1, y: 0 }, Direction.N);
  dirs.set({ x: 2, y: 1 }, Direction.E);
  dirs.set({ x: 1, y: 2 }, Direction.S);
  dirs.set({ x: 0, y: 1 }, Direction.W);

  return (point: Vector2): Direction | null => {
    return dirs.get({ x: point.x + 1, y: point.y + 1 }) ?? null;
  };
})();

export { getTargetAOE, getCirclePoints } from './aoe';
export { roll } from './random';
export * as RNG from './random';
export { Sprite as T } from './tiles';

export * from './actions';
export * from './tiles';
export * from './dialogue';
export * from './constants';
export * from './tests';
export * from './decorators';
export * from './misc';
export * from './geometry';
