import type { Point, RGBColor, Size } from '@types';

import { Array2D } from '@lib';
import { Direction } from '@types';

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const RESOLUTION = 3;
export const AMBIENT_LIGHT: RGBColor = [80, 80, 80];
export const AMBIENT_DARK: RGBColor = [30, 30, 30];

export const map: Size = { w: 16 * 4, h: 16 * 4 };
export const view: Size = { w: 1280 / RESOLUTION, h: 720 / RESOLUTION };

export function tileAt({ x, y }: Point): [number, number] {
  return [x * TILE_WIDTH, y * TILE_HEIGHT];
}

export function getDistance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

export function isWithin(a: Point, points: Point[]): boolean {
  return points.some(p => p.x === a.x && p.y === a.y);
}

export function isSamePoint(a?: Point, b?: Point): boolean {
  return a && b ? a.x === b.x && a.y === b.y : false;
}

export function add(...points: Point[]): Point {
  let x = 0;
  let y = 0;

  for (const point of points) {
    x += point.x;
    y += point.y;
  }
  return { x, y };
}

export function getInteractionPos(point: Point & { d: Direction }): Point {
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
  const dirs = new Array2D<Direction>({ w: 3, h: 3 });
  dirs.set({ x: 1, y: 0 }, Direction.N);
  dirs.set({ x: 2, y: 1 }, Direction.E);
  dirs.set({ x: 1, y: 2 }, Direction.S);
  dirs.set({ x: 0, y: 1 }, Direction.W);

  return (point: Point): Direction | null => {
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

export { getTargetAOE } from './aoe';
export { timer, roll } from './misc';
export { Sprite as T } from './tiles';
