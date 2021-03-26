import { Tag } from '@enums';
import type { Vector2 } from '@types';
import { Pathfinding } from 'malwoden';
import type { Entity } from 'tecs';
import type { MapBuilder } from './MapBuilder';
import { CollisionMap } from './CollisionMap';
import { CHUNK_HEIGHT, CHUNK_WIDTH } from '@utils';
import type { GeneratorResponse, GeneratorPayload } from '../workers/maps';
import { Vector2Array } from './Vector2Array';
import { Builder } from '../maps/generators/Empty';

export interface ChunkOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Chunk {
  public map: MapBuilder;
  public paths: Pathfinding.AStar;
  public collisions: CollisionMap;

  protected point: Vector2;
  protected worker: Worker;

  public entities: Entity[] = [];

  public get x(): number {
    return this.point.x;
  }

  public get y(): number {
    return this.point.y;
  }

  public unload(): void {
    for (const e of this.entities) {
      e.tags.add(Tag.TO_UNRENDER);
    }

    this.entities = [];
  }

  public async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.worker.onerror = reject;
      this.worker.onmessage = (res: MessageEvent<GeneratorResponse>) => {
        const tiles = res.data.tiles;
        this.map.history.push(Vector2Array.from(tiles));
        this.worker.terminate();
        resolve();
      };
      this.worker.postMessage({
        ...this.point,
        width: CHUNK_WIDTH,
        height: CHUNK_HEIGHT,
        builder: 'DrunkardsWalk'
      } as GeneratorPayload);
    });
  }

  public constructor({ x, y, width, height }: ChunkOptions) {
    this.point = { x, y };
    this.worker = new Worker(new URL('../workers/maps', import.meta.url));
    this.map = new Builder({ width, height });
    this.collisions = new CollisionMap(this.map.bounds);
    this.paths = new Pathfinding.AStar({
      isBlockedCallback: pt => !this.collisions.isPassable(pt),
      topology: 'four'
    });
  }
}
