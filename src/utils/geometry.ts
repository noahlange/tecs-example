import type { Rectangle } from '@lib';
import type { Vector2 } from '@types';
import { RNG } from '@utils';
import { Direction } from '@enums';

import {
  CHUNK_HEIGHT,
  CHUNK_RADIUS,
  CHUNK_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH
} from './constants';

const deltas: Vector2[] = [
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 1 }
];

export function getRandomNeighbor(point: Vector2, bounds?: Rectangle): Vector2 {
  const d = RNG.shuffle(deltas.slice());
  let delta = d.shift();

  while (delta && d.length > 0) {
    const next = { x: point.x + delta.x, y: point.y + delta.y };

    if (bounds) {
      if (bounds.contains(next)) {
        return next;
      }
    } else return next;

    delta = d.shift();
  }

  return point;
}

export function getRandomPoint(bounds: Rectangle): Vector2 {
  return {
    x: RNG.int.between(0, bounds.width),
    y: RNG.int.between(0, bounds.height)
  };
}

/**
 * convert a world coordinate `{ x, y }` to a chunk + position coordinate tuple
 *
 * @example
 * // given a chunk size of 8
 * const world = { x: -14, y: 15 };
 * const [chunk, pos] = toLocal(world);
 * // chunk: { x: -2, y: 1 }
 * // pos: { x: 6, y: 7 }
 */
export function toChunkPosition(world: Vector2): [Vector2, Vector2] {
  const x = Math.floor(world.x / CHUNK_WIDTH);
  const y = Math.floor(world.y / CHUNK_HEIGHT);
  return [
    { x, y },
    { x: world.x - x * CHUNK_WIDTH, y: world.y - y * CHUNK_HEIGHT }
  ];
}

export function fromChunkPosition(chunk: Vector2, pos: Vector2): Vector2 {
  const x = chunk.x * CHUNK_WIDTH;
  const y = chunk.y * CHUNK_HEIGHT;
  return { x: x + pos.x, y: y + pos.y };
}

/**
 * Returns the world coordinate `{x, y}` relative to a central world coordinate. If the coord is outside the CHUNK_RADIUS, return null.
 * @example
 * // given a chunk size of 8
 * const center = { x: 0, y: 0 };
 * const world = { x: 16, y: -8 };
 * toRelative(center, world); // { x: 2, y: -1 }
 */
export function toRelative(center: Vector2, point: Vector2): Vector2 | null {
  const [chunk, pos] = toChunkPosition(point);
  const relativeX = chunk.x - center.x;
  const relativeY = chunk.y - center.y;
  if (
    Math.abs(relativeX) <= CHUNK_RADIUS &&
    Math.abs(relativeY) <= CHUNK_RADIUS
  ) {
    const shiftX = relativeX + CHUNK_RADIUS;
    const shiftY = relativeY + CHUNK_RADIUS;
    const tileX = shiftX * CHUNK_WIDTH + pos.x;
    const tileY = shiftY * CHUNK_HEIGHT + pos.y;
    return { x: tileX, y: tileY };
  }
  return null;
}

/**
 * Given the absolute position of a coordinate relative to another world coordinate.
 */
export function fromRelative(center: Vector2, relative: Vector2): Vector2 {
  const tileX = Math.floor(relative.x / TILE_WIDTH);
  const tileY = Math.floor(relative.y / TILE_HEIGHT);
  const relX = tileX - CHUNK_RADIUS * CHUNK_WIDTH;
  const relY = tileY - CHUNK_RADIUS * CHUNK_HEIGHT;
  return { x: center.x + relX, y: center.y + relY };
}

export function getTransformFromDirection(d: Direction): [number, number] {
  switch (d) {
    case Direction.N:
    case Direction.S:
      return [0, 0];
    case Direction.W:
    case Direction.NW:
    case Direction.SW:
      return [1, 1];
    case Direction.E:
    case Direction.NE:
    case Direction.SE:
      return [-1, 1];
  }
}
