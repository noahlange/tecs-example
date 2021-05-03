import type { Vector2 } from '../../lib/types';

import { Direction } from '@lib/enums';

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

export function getTransformFromDirection(d: Direction): Vector2 | null {
  switch (d) {
    // flip right
    case Direction.W:
    case Direction.NW:
    case Direction.SW:
      return { x: 1, y: 1 };
    // flip left
    case Direction.E:
    case Direction.NE:
    case Direction.SE:
      return { x: -1, y: 1 };
    default:
      // no change
      return null;
  }
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
