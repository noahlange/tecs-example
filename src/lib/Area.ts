import type { Game } from '@core/Game';
import type { Vector2, Color } from '@types';
import type { TileType } from '@enums';

import { Pathfinding } from 'malwoden';

import {
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  CHUNK_RADIUS,
  toChunkPosition,
  iterateAcross,
  asyncWorker
} from '@utils';

import { Chunk } from './Chunk';
import { Vector2Array } from './Vector2Array';

import type { LightingPayload, LightingResponse } from '../workers/lighting';

interface AreaOptions {
  x: number;
  y: number;
}
// Display wrapper for an arbitrary number of chunks.
export class Area {
  public static chunks = {
    width: 1 + CHUNK_RADIUS * 2,
    height: 1 + CHUNK_RADIUS * 2
  };

  protected chunks: Vector2Array<Chunk> = new Vector2Array(Area.chunks);
  // cross-chunk static lighting
  protected lights: Vector2Array<Vector2Array<Color>[]> = new Vector2Array(
    Area.chunks
  );

  protected point: Vector2 = { x: 0, y: 0 };

  protected game: Game;

  public paths: Pathfinding.AStar = new Pathfinding.AStar({
    topology: 'four',
    isBlockedCallback: point => this.isPassable(point)
  });

  public getSpawn(chunk: Vector2 = { x: 0, y: 0 }): Vector2 {
    const c = this.chunks.get({
      x: chunk.x + CHUNK_RADIUS,
      y: chunk.y + CHUNK_RADIUS
    });
    const r = c.getSpawn();
    return {
      x: chunk.x * CHUNK_WIDTH + r.x,
      y: chunk.y * CHUNK_WIDTH + r.y
    };
  }

  public collisions = {
    isPassable: this.isPassable.bind(this),
    isVisible: this.isVisible.bind(this),
    set: this.setCollision.bind(this)
  };

  public get x(): number {
    return this.point.x;
  }

  public get y(): number {
    return this.point.y;
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
    for (const x of iterateAcross(dx, [0, max])) {
      for (const y of iterateAcross(dy, [0, max])) {
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
        // chunk generation is async, but we don't need to wait for that to finish before moving on to another chunk
        tasks.push(chunk.generate('CellularAutomata'));
      }
    }

    const chunks = await Promise.all(tasks);

    const size = {
      width: Area.chunks.width * CHUNK_WIDTH,
      height: Area.chunks.height * CHUNK_HEIGHT
    };

    // collapse all the vector arrays into a single vector array
    const { lights, tiles } = Array.from(this.chunks.entries()).reduce(
      (a, [point, chunk]) => {
        const worldX = point.x * CHUNK_WIDTH;
        const worldY = point.y * CHUNK_HEIGHT;

        for (const [point, tile] of chunk.tiles.entries()) {
          a.tiles.set({ x: worldX + point.x, y: worldY + point.y }, tile);
        }
        for (const [point, light] of chunk.lights.entries()) {
          a.lights.set({ x: worldX + point.x, y: worldY + point.y }, light);
        }
        return a;
      },
      {
        tiles: new Vector2Array<TileType>(size),
        lights: new Vector2Array<Color>(size)
      }
    );

    const worker = asyncWorker(
      new Worker(new URL('../workers/lighting', import.meta.url))
    );

    const res = await worker.run<LightingPayload, LightingResponse>({
      tiles: Array.from(tiles.entries()),
      lights: Array.from(lights.entries())
    });

    // e.g., 48x48
    for (const [point, color] of res.tints) {
      // e.g., 0-2
      const chunkX = Math.floor(point.x / CHUNK_WIDTH);
      const chunkY = Math.floor(point.y / CHUNK_HEIGHT);
      // debugger;
      const chunk = this.chunks.get({ x: chunkX, y: chunkY });
      const chunkStartX = chunkX * CHUNK_WIDTH;
      const chunkStartY = chunkY * CHUNK_HEIGHT;
      const pointInChunk = {
        x: point.x - chunkStartX,
        y: point.y - chunkStartY
      };

      chunk.tints.set(pointInChunk, color);
    }

    for (const chunk of chunks) {
      chunk.create();
    }

    for (const chunk of this.chunks.values()) {
      chunk.update();
    }

    this.game.emit('init.area', this);
  }

  public set center(next: Vector2) {
    const curr = this.point;
    this.point = next;
    this.updateChunks(curr, next);
  }

  /**
   * Return the local chunk the point resides in; null if it isn't within view.
   */
  public chunkAt(world: Vector2): [Chunk | null, Vector2] {
    const [chunk, position] = toChunkPosition(world);
    const chunkX = chunk.x - this.x;
    const chunkY = chunk.y - this.y;
    return [
      this.chunks.get({ x: chunkX + CHUNK_RADIUS, y: chunkY + CHUNK_RADIUS }) ??
        null,
      position
    ];
  }

  protected isVisible(pos: Vector2): boolean {
    const [chunk, point] = this.chunkAt(pos);
    return chunk?.collisions.isVisible(point) !== false;
  }

  protected isPassable(pos: Vector2): boolean {
    const [chunk, point] = this.chunkAt(pos);
    return chunk?.collisions.isPassable(point) !== false;
  }

  protected setCollision(
    point: Vector2,
    allowLOS: boolean,
    isPassable: boolean
  ): void {}

  public constructor(game: Game, options: AreaOptions) {
    this.game = game;
    const { x, y } = options;
    this.point = { x, y };
  }
}
