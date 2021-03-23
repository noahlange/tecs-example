import type { Vector2, Size, Color } from '@types';

import { Vector2Array } from '@lib';
import { Direction } from '@enums';

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;

export const RESOLUTION = 3;

export const map: Size = { w: 80, h: 40 };
export const view: Size = { w: 1920 / RESOLUTION, h: 1080 / RESOLUTION };

export const AMBIENT_LIGHT: Color = { r: 80, g: 80, b: 80, a: 1 };
export const AMBIENT_DARK: Color = { r: 30, g: 30, b: 30, a: 1 };

export function tileAt({ x, y }: Vector2): [number, number] {
  return [x * TILE_WIDTH, y * TILE_HEIGHT];
}

export function getDistance(a: Vector2, b: Vector2): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

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
  let x = 0;
  let y = 0;

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
  const dirs = new Vector2Array<Direction>({ w: 3, h: 3 });
  dirs.set({ x: 1, y: 0 }, Direction.N);
  dirs.set({ x: 2, y: 1 }, Direction.E);
  dirs.set({ x: 1, y: 2 }, Direction.S);
  dirs.set({ x: 0, y: 1 }, Direction.W);

  return (point: Vector2): Direction | null => {
    return (
      dirs.get({
        x: point.x + 1,
        y: point.y + 1
      }) ?? null
    );
  };
})();

export * from './actions';
export * from './tests';
export * from './tiles';
export * from './dialogue';
export * from './pixi';

export * as RNG from './random';

export { getTargetAOE, getCirclePoints } from './aoe';
export { timer, roll } from './misc';
export { Sprite as T } from './tiles';
export { getRandomNeighbor } from './geometry';
