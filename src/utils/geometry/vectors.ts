import type { Rect, Vector2 } from '@lib/types';

import { Rectangle } from '@lib';

import {
  CHUNK_HEIGHT,
  CHUNK_RADIUS,
  CHUNK_WIDTH,
  TILE_HEIGHT,
  TILE_WIDTH
} from '../';
import { int, pick } from '../random';
import { iterateGrid } from './iterators';

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

/**
 * Convert a world + position tuple to a world coordinate.
 */
export function fromChunkPosition(chunk: Vector2, pos: Vector2): Vector2 {
  const x = chunk.x * CHUNK_WIDTH;
  const y = chunk.y * CHUNK_HEIGHT;
  return { x: x + pos.x, y: y + pos.y };
}

export function contains(a: Vector2, points: Vector2[]): boolean {
  return points.some(p => p.x === a.x && p.y === a.y);
}

export function isSamePoint(a?: Vector2, b?: Vector2): boolean {
  return a && b ? a.x === b.x && a.y === b.y : false;
}

export function getRandomPoint(bounds: Rectangle): Vector2 {
  return {
    x: int.between(0, bounds.width),
    y: int.between(0, bounds.height)
  };
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

/**
 * Return all points adjacent to a given point
 * @param point
 * @param bounds
 * @returns
 */
export function getNeighbors(
  point: Vector2,
  radius: number = 1,
  bounds?: Rect
): Vector2[] {
  const size = 1 + radius * 2;
  const points = iterateGrid(
    { width: size, height: size },
    { x: -radius, y: -radius }
  );

  return Array.from(points)
    .filter(({ x, y }) => x || y)
    .map(({ x, y }) => ({ x: x + point.x, y: y + point.y }))
    .filter(({ x, y }) => !bounds || new Rectangle(bounds).contains({ x, y }));
}

export function getRandomNeighbor(point: Vector2, bounds?: Rect): Vector2 {
  return pick(getNeighbors(point, 1, bounds)) ?? point;
}

export function add(...points: Vector2[]): Vector2 {
  let [x, y] = [0, 0];
  for (const point of points) {
    x += point.x;
    y += point.y;
  }
  return { x, y };
}
