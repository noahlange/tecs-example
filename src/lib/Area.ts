import type { Game } from '@core/Game';
import type { Vector2 } from '@types';

import { Pathfinding } from 'malwoden';

import { TileType } from '@enums';
import { Cell } from '@ecs/entities';
import {
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  CHUNK_RADIUS,
  toChunkPosition,
  iterateAcross,
  AMBIENT_LIGHT
} from '@utils';

import { Chunk } from './Chunk';
import { Vector2Array } from './Vector2Array';

interface AreaOptions {
  x: number;
  y: number;
}

// Display wrapper for an arbitrary number of chunks.
export class Area {
  protected chunks: Vector2Array<Chunk> = new Vector2Array({
    width: 1 + CHUNK_RADIUS * 2,
    height: 1 + CHUNK_RADIUS * 2
  });

  protected cx: number = 0;
  protected cy: number = 0;
  protected game: Game;

  public paths: Pathfinding.AStar = new Pathfinding.AStar({
    topology: 'four',
    isBlockedCallback: point => this.isPassable(point)
  });

  public collisions = {
    isPassable: this.isPassable.bind(this),
    isVisible: this.isVisible.bind(this),
    set: this.setCollision.bind(this)
  };

  public get x(): number {
    return this.cx;
  }

  public get y(): number {
    return this.cy;
  }

  protected updateChunks(from: Vector2, to: Vector2): void {
    // determine which axis we're working on
    const [dx, dy] = [to.x - from.x, to.y - from.y];
    // return the corresponding axis and max value
    const [xy, max] =
      dx !== 0
        ? ['x' as const, CHUNK_RADIUS * 2]
        : ['y' as const, CHUNK_RADIUS * 2];

    // find the first/last rows (or columns, but I'll call them rows for sanity's sake), swap min/max per direction
    const [start, end] = to[xy] - from[xy] > 0 ? [0, max] : [max, 0];
    // iterate through the chunks based on the direction we're moving
    for (const x of iterateAcross(dx, max)) {
      for (const y of iterateAcross(dy, max)) {
        const pos = { x, y };
        // find the chunk (possibly undefined)
        let chunk = this.chunks.get(pos);
        // ...we only care about deleting/moving it if it actually exists
        if (chunk) {
          // if this is the "starting" row, unload the chunk
          if (pos[xy] === start) {
            chunk?.unload();
            this.chunks.delete(pos);
            // don't create a new chunk, we'll be moving an existing one here
            continue;
          } else {
            // if it _isn't the first row, move the chunk in the appropriate direction
            this.chunks.set({ x: x - dx, y: y - dy }, chunk);
            // only add a new chunk if we're working on the final row—in which case we've stolen its chunk and don't have anything to shift in to replace it
            if (pos[xy] !== end) {
              continue;
            }
          }
        }

        // we've either moved a chunk out of its current space or haven't created one yet; make a new chunk
        chunk = new Chunk({
          width: CHUNK_WIDTH,
          height: CHUNK_HEIGHT,
          x: (to.x + pos.x - CHUNK_RADIUS) * CHUNK_WIDTH,
          y: (to.y + pos.y - CHUNK_RADIUS) * CHUNK_HEIGHT
        });

        this.chunks.set(pos, chunk);
        // chunk generation is async, but we don't want to wait for that to finish before moving on
        this.loadChunk(chunk);
      }
    }
  }

  protected async loadChunk(chunk: Chunk): Promise<void> {
    await chunk.load();
    for (const [point, tile] of chunk.map.entries()) {
      const isWall = tile === TileType.WALL;
      const entity = this.game.ecs.create(Cell, {
        position: { x: chunk.x + point.x, y: chunk.y + point.y },
        collision: { passable: !isWall, allowLOS: !isWall },
        render: { dirty: true },
        sprite: {
          key: isWall ? 'wall_01_ew' : 'floor_02_06',
          tint: chunk.tints.get(point) ?? AMBIENT_LIGHT
        }
      });
      chunk.entities.push(entity);
    }
  }

  public set center(next: Vector2) {
    const curr = { x: this.cx, y: this.cy };
    this.cx = next.x;
    this.cy = next.y;
    this.updateChunks(curr, next);
    this.game.emit('initMap');
  }

  public chunkAt(world: Vector2): [Chunk | null, Vector2] {
    const [chunk, position] = toChunkPosition(world);
    const chunkX = chunk?.x - this.cx + CHUNK_RADIUS;
    const chunkY = chunk?.y - this.cy + CHUNK_RADIUS;

    return [
      this.chunks.get({
        x: chunkX,
        y: chunkY
      }) ?? null,
      position
    ];
  }

  protected isVisible(pos: Vector2): boolean {
    const [chunk, point] = this.chunkAt(pos);
    return chunk?.collisions.isVisible(point) ?? false;
  }

  protected isPassable(pos: Vector2): boolean {
    const [chunk, point] = this.chunkAt(pos);
    return chunk?.collisions.isVisible(point) ?? false;
  }

  protected setCollision(
    point: Vector2,
    allowLOS: boolean,
    isPassable: boolean
  ): void {
    const [chunk, pos] = this.chunkAt(point);
    chunk?.collisions.set(pos, allowLOS, isPassable);
  }

  public *entries(): IterableIterator<[Vector2, TileType]> {
    for (const [_, chunk] of this.chunks.entries()) {
      for (const [point, tile] of chunk.map.entries()) {
        yield [{ x: chunk.x + point.x, y: chunk.y + point.y }, tile];
      }
    }
  }

  public constructor(game: Game, options: AreaOptions) {
    this.game = game;
    this.cx = options.x;
    this.cy = options.y;
    this.center = { x: 0, y: 0 };
  }
}
