import type { Rectangle } from '@lib';
import type { Vector2 } from '@types';
import { shuffle } from '@utils/random';

const deltas: Vector2[] = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 }
];

export function getRandomNeighbor(point: Vector2, bounds?: Rectangle): Vector2 {
  const d = shuffle(deltas.slice());
  let delta = d.shift();

  while (delta && d.length > 0) {
    const next = { x: point.x + delta.x, y: point.y + delta.y };

    if (!(next.x === point.x && next.y === point.y) && bounds) {
      if (
        next.x >= bounds.x1 &&
        next.y >= bounds.y1 &&
        next.x <= bounds.x2 &&
        next.y <= bounds.y2
      ) {
        return next;
      }
    } else {
      return next;
    }

    delta = d.shift();
  }

  return point;
}
