import type { Rect, Size, Vector2 } from '../../lib/types';

/**
 * Yield numbers from `0` → `count` (positive) or `count` → `0` (negative).
 * @param d - direction; negative (right to left) or positive/zero (left to right)
 * @param range - [ min, max ]
 */
export function* iterateLine(
  d: number,
  range: [number, number]
): IterableIterator<number> {
  const min = Math.min(...range);
  const max = Math.max(...range);
  if (d >= 0) {
    for (let i = min; i <= max; i++) {
      yield i;
    }
  } else {
    for (let i = max; i >= min; i--) {
      yield i;
    }
  }
}

type Griddable = Rect | Size | Vector2;

const isRect = (a: Griddable): a is Rect => (a as Rect)?.x1 !== undefined;
const isPoint = (a: Griddable): a is Vector2 => (a as Vector2)?.x !== undefined;
const isSize = (a: Griddable): a is Size => (a as Size).width !== undefined;

/**
 * Given a rectangle, iterate through each point within.
 * @param rect - bounds
 * @param start - coordinate offset (optional, defaults to `{ x: 0, y: 0 }`)
 */
export function iterateGrid(
  rect: Rect,
  start?: Vector2
): IterableIterator<Vector2>;
/**
 * Given a width and height, iterate through each point inside the rectangle.
 * @param size - dimensions
 * @param start - start point (optional, defaults to `{ x: 0, y: 0 }`)
 */
export function iterateGrid(
  size: Size,
  start?: Vector2
): IterableIterator<Vector2>;
/**
 * Given two points (NW/SE), iterate through each point within bounds
 * @param start - start point
 * @param end - end point (excluded)
 */
export function iterateGrid(
  start: Vector2,
  end: Vector2
): IterableIterator<Vector2>;
export function* iterateGrid(
  a: Size | Vector2 | Rect,
  b: Vector2 = { x: 0, y: 0 }
): IterableIterator<Vector2> {
  // eurgh, this is gross
  const { x1, x2, y1, y2 } = (() => {
    if (isRect(a)) {
      return a;
    }
    if (isPoint(a)) {
      // @todo handle -/+ switcheroos
      return {
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y
      };
    }
    if (isSize(a)) {
      return {
        x1: b.x,
        y1: b.y,
        x2: b.x + a.width,
        y2: b.y + a.height
      };
    }
    return { x1: 0, y1: 0, x2: 0, y2: 0 };
  })();

  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      yield { x, y };
    }
  }
}
