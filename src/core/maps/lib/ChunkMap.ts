import type { CollisionMethods, Color, Vector2 } from '../../../lib/types';
import type { GameTileData } from '@lib';
import type { LightingPayload, LightingResponse } from '@workers/lighting';

import { Vector2Array } from '@lib';
import { Collision } from '@lib/enums';
import { CHUNK_HEIGHT, CHUNK_RADIUS, CHUNK_WIDTH, work } from '@utils';
import { fromRelative, iterateLine, toChunkPosition } from '@utils/geometry';
import Worker from '@workers/lighting?worker';
import { FOV } from 'malwoden';

import { Chunk } from './Chunk';
import { WorldMap } from './WorldMap';

// Display wrapper for an arbitrary number of chunks.
export class ChunkMap extends WorldMap {
  public static chunks = {
    width: CHUNK_RADIUS * 2 + 1,
    height: CHUNK_RADIUS * 2 + 1
  };

  protected chunks: Vector2Array<Chunk> = new Vector2Array(ChunkMap.chunks);
  // cross-chunk static lighting
  protected lights: Vector2Array<Vector2Array<Color>[]> = new Vector2Array(
    ChunkMap.chunks
  );

  public getSpawn(chunk: Vector2 = { x: 0, y: 0 }): Vector2 {
    const c = this.chunks.get({
      x: chunk.x + CHUNK_RADIUS,
      y: chunk.y + CHUNK_RADIUS
    });

    if (c) {
      const r = c.getSpawn();
      return {
        x: chunk.x * CHUNK_WIDTH + r.x,
        y: chunk.y * CHUNK_WIDTH + r.y
      };
    }

    return chunk;
  }

  public toJSON(): object {
    return {
      ...this.point,
      chunks: this.chunks
    };
  }

  protected async updateChunks(from: Vector2, to: Vector2): Promise<void> {
    const tasks: Promise<Chunk>[] = [];
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
    for (const x of iterateLine(dx, [0, max])) {
      for (const y of iterateLine(dy, [0, max])) {
        const pos = { x, y };
        // find the chunk (possibly undefined)
        let chunk = this.chunks.get(pos);
        // ...we only care about deleting/moving it if it actually exists
        if (chunk) {
          // if this is the "starting" row, unload the chunk
          if (pos[xy] === start) {
            chunk.unload();
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
          game: this.game,
          width: CHUNK_WIDTH,
          height: CHUNK_HEIGHT,
          x: to.x + pos.x - CHUNK_RADIUS,
          y: to.y + pos.y - CHUNK_RADIUS
        });

        this.chunks.set(pos, chunk);
        // chunk generation is async, but we don't need to wait for it to finish before moving on to another chunk
        tasks.push(chunk.generate('CellularAutomata'));
      }
    }

    const chunks = await Promise.all(tasks);

    const size = {
      width: ChunkMap.chunks.width * CHUNK_WIDTH,
      height: ChunkMap.chunks.height * CHUNK_HEIGHT
    };

    const reduced = {
      tiles: new Vector2Array<GameTileData>(size),
      lights: new Vector2Array<Color>(size)
    };

    // collapse all the vector arrays into a single vector array
    for (const [point, chunk] of this.chunks.entries()) {
      const x = point.x * CHUNK_WIDTH;
      const y = point.y * CHUNK_HEIGHT;
      for (const [point, tile] of chunk.tiles.entries()) {
        reduced.tiles.set({ x: x + point.x, y: y + point.y }, tile);
      }
      for (const [point, light] of chunk.lights.entries()) {
        reduced.lights.set({ x: x + point.x, y: y + point.y }, light);
      }
    }

    const worker = work(new Worker());

    const res = await worker.run<LightingPayload, LightingResponse>({
      tiles: Array.from(reduced.tiles.entries()),
      lights: Array.from(reduced.lights.entries())
    });

    // e.g., 48x48
    for (const [point, color] of res.tints) {
      // e.g., 0-2
      const chunkX = Math.floor(point.x / CHUNK_WIDTH);
      const chunkY = Math.floor(point.y / CHUNK_HEIGHT);
      const chunk = this.chunks.get({ x: chunkX, y: chunkY });
      if (chunk) {
        const pointInChunk = {
          x: point.x - chunkX * CHUNK_WIDTH,
          y: point.y - chunkY * CHUNK_HEIGHT
        };
        chunk.tints.set(pointInChunk, color);
      }
    }

    for (const chunk of chunks) {
      chunk.create();
    }

    for (const chunk of this.chunks.values()) {
      chunk.update();
    }

    this.game.ecs.update();
    this.game.emit('init.map.chunks', this);
  }

  public set center(next: Vector2) {
    const curr = this.point;
    this.point = next;
    this.fov = new FOV.PreciseShadowcasting({
      lightPasses: point => !this.isObstruction(fromRelative(this, point)),
      topology: 'four',
      cartesianRange: true
    });
    this.updateChunks(curr, next);
  }

  public async generate(): Promise<void> {
    this.center = { x: 0, y: 0 };
  }

  /**
   * Return the local chunk the point resides in; null if it isn't within view.
   */
  protected chunkAt(world: Vector2): [Chunk | null, Vector2] {
    const [chunk, position] = toChunkPosition(world);
    const chunkX = chunk.x - this.x;
    const chunkY = chunk.y - this.y;
    const point = { x: chunkX + CHUNK_RADIUS, y: chunkY + CHUNK_RADIUS };
    return [this.chunks.get(point) ?? null, position];
  }

  protected isObstruction(pos: Vector2): boolean {
    const [chunk, point] = this.chunkAt(pos);
    return chunk?.collisions.isObstruction(point) ?? false;
  }

  protected isObstacle(pos: Vector2): boolean {
    const [chunk, point] = this.chunkAt(pos);
    return !chunk?.collisions.isObstacle(point);
  }

  public collisions: CollisionMethods = {
    isObstacle: (pos: Vector2): boolean => {
      const [chunk, point] = this.chunkAt(pos);
      return chunk?.collisions.isObstacle(point) ?? false;
    },
    isObstruction: (pos: Vector2): boolean => {
      const [chunk, point] = this.chunkAt(pos);
      return chunk?.collisions.isObstruction(point) ?? false;
    },
    set: (pos: Vector2, isObstacle: boolean, isObstruction: boolean) => {
      const [chunk, point] = this.chunkAt(pos);
      const tile = chunk?.tiles.get(point);
      if (chunk && tile) {
        chunk.tiles.set(point, {
          ...tile,
          collision:
            (isObstacle ? Collision.OBSTACLE : Collision.NONE) +
            (isObstruction ? Collision.OBSTRUCTION : Collision.NONE)
        });
      }
    }
  };
}
