import type { Color, Vector2 } from '@types';
import type { Entity } from 'tecs';
import type { GeneratorResponse, GeneratorPayload } from '../workers/maps';
import type * as Builders from '../maps/generators';
import type { Game } from '@core/Game';

import * as prefabs from '@ecs/prefabs';
import { Tag, TileType } from '@enums';
import { Pathfinding } from 'malwoden';
import { CollisionMap } from './CollisionMap';
import { AMBIENT_DARK, asyncWorker, CHUNK_HEIGHT, CHUNK_WIDTH } from '@utils';
import { Vector2Array } from './Vector2Array';
import { Cell } from '@ecs/entities';
import { Rectangle } from './Rectangle';
import { getRandomPoint } from '../utils/geometry';

export interface ChunkOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
}

const prefabItems = [...prefabs.armor, ...prefabs.items, ...prefabs.weapons];
const size = {
  width: CHUNK_WIDTH,
  height: CHUNK_HEIGHT
};

export class Chunk {
  public paths: Pathfinding.AStar;
  public tints: Vector2Array<Color>;
  public tiles: Vector2Array<TileType>;
  public lights: Vector2Array<Color>;
  public bounds: Rectangle;
  public collisions: CollisionMap;

  protected game: Game;

  /**
   * Chunk coordinate (e.g., 1, 2)
   */
  protected point: Vector2;

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

  public getSpawn(): Vector2 {
    const { width, height } = this.bounds;
    const max = width * height;

    let i = 0;
    let point: Vector2 | null = null;
    do {
      point = getRandomPoint(this.bounds);
      if (this.collisions.isPassable(point)) {
        return point;
      } else {
        point = null;
      }
    } while (point === null && i++ < max);

    return this.bounds.center;
  }

  public create(): void {
    for (const [point, type] of this.tiles.entries()) {
      const tint = this.tints.get(point) ?? AMBIENT_DARK;
      const notWall = type !== TileType.WALL;
      const entity = this.game.ecs.create(
        Cell,
        {
          position: {
            x: this.x * CHUNK_WIDTH + point.x,
            y: this.y * CHUNK_WIDTH + point.y
          },
          collision: { passable: notWall, allowLOS: notWall },
          render: { dirty: true },
          sprite: {
            key: notWall ? 'floor_02_06' : 'wall_01_ew',
            tint
          }
        },
        [Tag.IS_IMPERMANENT]
      );
      this.entities.push(entity);
    }
  }

  public toString(): string {
    return this.tiles.toString();
  }

  public async generate(
    builder: keyof typeof Builders = 'Empty'
  ): Promise<this> {
    const worker = asyncWorker(
      new Worker(new URL('../workers/maps', import.meta.url))
    );

    const data = await worker.run<GeneratorPayload, GeneratorResponse>({
      x: this.point.x,
      y: this.point.y,
      width: CHUNK_WIDTH,
      height: CHUNK_HEIGHT,
      builder
    });
    // debugger;

    this.tiles = new Vector2Array<TileType>(size);

    for (const [point, type] of data.tiles) {
      this.collisions.set(point, type !== TileType.WALL);
      this.tiles.set(point, type);
    }

    for (const [point, color] of data.lights) {
      this.lights.set(point, color);
    }

    for (const prefab of data.prefabs) {
      const found = prefabItems.find(p => p.id === prefab.id);
      if (found) {
        // this.entities.push(
        //   // @todo: make sure we aren't double-spawning prefabs
        //   this.game.ecs.create(found.entity, prefab.data, prefab.tags)
        // );
      }
    }

    return this;
  }

  public constructor({ x, y, width, height, game }: ChunkOptions) {
    this.game = game;
    this.point = { x, y };
    this.tiles = new Vector2Array({ width, height });
    this.tints = new Vector2Array({ width, height });
    this.lights = new Vector2Array({ width, height });
    this.bounds = new Rectangle({
      x1: 0,
      x2: width,
      y1: 0,
      y2: height
    });

    this.collisions = new CollisionMap(this.bounds);
    this.paths = new Pathfinding.AStar({
      isBlockedCallback: pt => !this.collisions.isPassable(pt),
      topology: 'four'
    });
  }
}
