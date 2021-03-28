import type { Color, Vector2 } from '@types';
import type { Entity } from 'tecs';
import type { MapBuilder } from './MapBuilder';
import type { GeneratorResponse, GeneratorPayload } from '../workers/maps';

import type * as Builders from '../maps/generators';
import { Tag, TileType } from '@enums';
import { Pathfinding } from 'malwoden';
import { CollisionMap } from './CollisionMap';
import { AMBIENT_LIGHT, CHUNK_HEIGHT, CHUNK_WIDTH } from '@utils';
import { Vector2Array } from './Vector2Array';
import { Builder } from '../maps/generators/Empty';
import type { Game } from '@core/Game';
import { Cell } from '@ecs/entities';

export interface ChunkOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
}

export class Chunk {
  public map: MapBuilder;
  public paths: Pathfinding.AStar;
  public tints: Vector2Array<Color>;

  public collisions: CollisionMap;
  protected game: Game;
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
      e.tags.add(
        e.tags.has(Tag.IS_IMPERMANENT)
          ? // flag stateless entities for destruction
            Tag.TO_DESTROY
          : // mark stateful entities inactive, but don't destroy
            Tag.IS_INACTIVE
      );
    }
    this.entities = [];
  }

  public async generate(
    builder: keyof typeof Builders = 'Empty'
  ): Promise<void> {
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
        for (const prefab of data.prefabs) {
          this.entities.push(
            // @todo: make sure we aren't double-spawning prefabs
            this.game.ecs.create(prefab.entity, prefab.data, prefab.tags)
          );
        }
        for (const [point, type] of data.tiles) {
          const isWall = type === TileType.WALL;
          tiles.set(point, type);
          this.collisions.set(point, !isWall, !isWall);
          const entity = this.game.ecs.create(
            Cell,
            {
              position: { x: this.x + point.x, y: this.y + point.y },
              collision: { passable: !isWall, allowLOS: !isWall },
              render: { dirty: true },
              sprite: {
                key: isWall ? 'wall_01_ew' : 'floor_02_06',
                tint: this.tints.get(point) ?? AMBIENT_LIGHT
              }
            },
            [Tag.IS_IMPERMANENT]
          );
          this.map.tiles = tiles;
          this.entities.push(entity);
        }

        this.worker.terminate();
        resolve();
      };
      this.worker.postMessage({
        ...this.point,
        width: CHUNK_WIDTH,
        height: CHUNK_HEIGHT,
        builder
      } as GeneratorPayload);
    });
  }

  public constructor({ x, y, width, height, game }: ChunkOptions) {
    this.game = game;
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
