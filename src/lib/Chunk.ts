import type { Color, Vector2 } from '@types';
import type { Entity } from 'tecs';
import type { MapBuilder } from './MapBuilder';
import type { GeneratorResponse, GeneratorPayload } from '../workers/maps';
import { Tag, TileType } from '@enums';
import { Pathfinding } from 'malwoden';
import { CollisionMap } from './CollisionMap';
import { CHUNK_HEIGHT, CHUNK_WIDTH } from '@utils';
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
  public tints: Vector2Array<Color>;

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
      this.worker.onmessage = ({ data }: MessageEvent<GeneratorResponse>) => {
        for (const [point, color] of data.tints) {
          this.tints.set(point, color);
        }
        const tiles = new Vector2Array<TileType>({
          width: CHUNK_WIDTH,
          height: CHUNK_HEIGHT
        });

        for (const [point, type] of data.tiles) {
          const isWall = type === TileType.WALL;
          tiles.set(point, type);
          this.collisions.set(point, !isWall, !isWall);
        }
        this.map.tiles = tiles;
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
    this.tints = new Vector2Array({ width, height });
    this.map = new Builder({ width, height });
    this.collisions = new CollisionMap(this.map.bounds);
    this.paths = new Pathfinding.AStar({
      isBlockedCallback: pt => !this.collisions.isPassable(pt),
      topology: 'four'
    });
  }
}
