import type { GameTileData } from '@lib';
import type { CollisionMethods, Color, Vector2 } from '@lib/types';

import { Vector2Array } from '@lib';
import { Collision } from '@lib/enums';
import { CHUNK_HEIGHT, CHUNK_RADIUS, CHUNK_WIDTH } from '@utils';
import {
  distance,
  fromRelative,
  getNeighbors,
  iterateGrid,
  iterateLine,
  toChunkPosition
} from '@utils/geometry';
import { FOV } from 'malwoden';

import { WorldMap } from '../lib/WorldMap';
import { Chunk } from './Chunk';

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
    // determine which axis we're working on
    const [dx, dy] = [to.x - from.x, to.y - from.y];
    // return the corresponding axis and max value
    const [xy, max] =
      dx !== 0
        ? ['x' as const, CHUNK_RADIUS * 2]
        : ['y' as const, CHUNK_RADIUS * 2];

    // find the first/last rows (or columns, but I'll call them rows for sanity's sake), swap min/max per direction
    const [start, end] = to[xy] - from[xy] > 0 ? [0, max] : [max, 0];
    const chunks: [Vector2, Chunk][] = [];
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
            // if it _isn't the first row, shift the chunk in the appropriate direction
            this.chunks.set({ x: x - dx, y: y - dy }, chunk);
            // only add a new chunk if we're working on the final row—in which case we've already shifted it away and have nothing to replace it
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
        chunks.push([pos, chunk]);
      }
    }

    // sort chunks by proximity to the center chunk
    const sortedByDistance = chunks
      .sort(([a], [b]) => distance(b, to) - distance(a, to))
      .map(([, chunk]) => chunk);

    for (const chunk of sortedByDistance) {
      // while chunk generation is parallelized, we don't want to wait for all the chunks to finish before drawing them
      chunk.generate('CellularAutomata').then(() => chunk.create());
    }

    /**
     * @todo
     * Perform lighting calculations on the seams of _newly-created_ chunks—we don't want to calculate more than we have to.
     * Example: after moving from E to B, we generate new chunks at A, B and C. We need to run lighting calculations on the seams of A+B, B+C, A+D, B+E, C+F. We'll ignore lights and tiles beyond the chunk's mid-point. Assuming we have 16-tile chunks, we will only be lighting:
     * - A (8,8 -> 15,15)
     * - B (0,7 -> 15,15)
     * - C (0,7 -> 8,15)
     * - D (7,0 -> 15,7)
     * - E (0,0 -> 15,7)
     * - F (0,0, 7,7).
     * An illustration:
     * ┏━━━┳━━━┳━━━┓
     * ┃      ┃      ┃      ┃
     * ┃  A ─┃─ B─┃─ C  ┃
     * ┃  │  ┃      ┃  │  ┃
     * ┣━┿━╋━━━╋━┿━┫
     * ┃  │  ┃      ┃  │  ┃
     * ┃  D ─╂─ E─╂─ F  ┃
     * ┃      ┃      ┃      ┃
     * ┣━━━╋━━━╋━━━┃
     * ┃      ┃      ┃      ┃
     * ┃  D   ┃  E   ┃  F   ┃
     * ┃      ┃      ┃      ┃
     * ┗━━━━━━━━━━━┛
     */
    const size = {
      width: CHUNK_WIDTH * CHUNK_RADIUS * 2,
      height: CHUNK_HEIGHT * CHUNK_RADIUS * 2
    };

    const minX = CHUNK_WIDTH / 2;
    const minY = CHUNK_HEIGHT / 2;
    const maxX = size.width - CHUNK_WIDTH / 2;
    const maxY = size.height - CHUNK_HEIGHT / 2;

    const tints = [];
    for (const { x, y } of iterateGrid(size)) {
      if (x >= minX || y >= minY) {
        if (x < maxX || y < maxY) {
          // only update these tiles
          tints.push({ x, y });
        }
      }
    }

    const reduced = {
      tiles: new Vector2Array<GameTileData>(size),
      lights: new Vector2Array<Color>(size)
    };

    const neighbors = getNeighbors({
      x: to.x - from.x,
      y: to.y - from.y
    })
      .filter(point => this.chunks.has(point))
      .map(point => [point, this.chunks.get(point)]) as [Vector2, Chunk][];

    // collapse NEW chunks and their neighbors into a single vector array
    for (const [cPos, chunk] of neighbors) {
      const baseX = cPos.x * CHUNK_WIDTH;
      const baseY = cPos.y * CHUNK_HEIGHT;

      for (const [tPos, tile] of chunk.tiles.entries()) {
        reduced.tiles.set({ x: baseX + tPos.x, y: baseY + tPos.y }, tile);
      }
      for (const [tPos, light] of chunk.lights.entries()) {
        reduced.lights.set({ x: baseX + tPos.x, y: baseY + tPos.y }, light);
      }
    }

    // const worker = work(new Worker());

    // const res = await worker.run<LightingPayload, LightingResponse>({
    //   tiles: Array.from(reduced.tiles.entries()),
    //   lights: Array.from(reduced.lights.entries())
    // });

    // for (const [point, color] of res.tints) {
    //   // e.g., 0-2
    //   const chunkX = Math.floor(point.x / CHUNK_WIDTH);
    //   const chunkY = Math.floor(point.y / CHUNK_HEIGHT);
    //   const chunk = this.chunks.get({ x: chunkX, y: chunkY });
    //   if (chunk) {
    //     const pointInChunk = {
    //       x: point.x - chunkX * CHUNK_WIDTH,
    //       y: point.y - chunkY * CHUNK_HEIGHT
    //     };
    //     chunk.tints.set(pointInChunk, color);
    //   }
    // }

    // for (const [, chunk] of neighbors) {
    //   chunk.update();
    // }

    // const size = {
    //   width: ChunkMap.chunks.width * CHUNK_WIDTH,
    //   height: ChunkMap.chunks.height * CHUNK_HEIGHT
    // };

    // const reduced = {
    //   tiles: new Vector2Array<GameTileData>(size),
    //   lights: new Vector2Array<Color>(size)
    // };

    // for (const chunk of newChunks) {
    //   chunk.create();
    // }

    // collapse all the vector arrays into a single vector array
    // for (const [point, chunk] of this.chunks.entries()) {
    //   const x = point.x * CHUNK_WIDTH;
    //   const y = point.y * CHUNK_HEIGHT;
    //   for (const [point, tile] of chunk.tiles.entries()) {
    //     reduced.tiles.set({ x: x + point.x, y: y + point.y }, tile);
    //   }
    //   for (const [point, light] of chunk.lights.entries()) {
    //     reduced.lights.set({ x: x + point.x, y: y + point.y }, light);
    //   }
    // }

    // const worker = work(new Worker());

    // const res = await worker.run<LightingPayload, LightingResponse>({
    //   tiles: Array.from(reduced.tiles.entries()),
    //   lights: Array.from(reduced.lights.entries())
    // });

    // e.g., 48x48

    // for (const [point, color] of res.tints) {
    //   // e.g., 0-2
    //   const chunkX = Math.floor(point.x / CHUNK_WIDTH);
    //   const chunkY = Math.floor(point.y / CHUNK_HEIGHT);
    //   const chunk = this.chunks.get({ x: chunkX, y: chunkY });
    //   if (chunk) {
    //     const pointInChunk = {
    //       x: point.x - chunkX * CHUNK_WIDTH,
    //       y: point.y - chunkY * CHUNK_HEIGHT
    //     };
    //     chunk.tints.set(pointInChunk, color);
    //   }
    // }

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
