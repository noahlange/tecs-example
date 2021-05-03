import { Collision } from '@lib/enums';

import { bit } from './';

export function isObstacle(collision: number = Collision.NONE): boolean {
  return bit.any(Collision.OBSTACLE, collision);
}

export function isObstruction(collision: number = Collision.NONE): boolean {
  return bit.any(Collision.OBSTRUCTION, collision);
}

export function isEmpty(collision: number = Collision.NONE): boolean {
  return bit.none(Collision.OBSTRUCTION + Collision.OBSTACLE, collision);
}
