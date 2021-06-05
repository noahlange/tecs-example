import type * as Builders from '../generators';
import type { Game } from '@core';
import type { GameTileData } from '@lib';
import type { Color, Vector2 } from '@lib/types';
import type { GeneratorPayload, GeneratorResponse } from '@workers/maps';
import type { Entity } from 'tecs';

import { Cell } from '@core/entities';
import * as prefabbed from '@game/prefabs';
import { Rectangle, Vector2Array } from '@lib';
import { Tag } from '@lib/enums';
import {
  AMBIENT_DARK,
  AMBIENT_LIGHT,
  CHUNK_HEIGHT,
  CHUNK_WIDTH,
  isObstacle,
  isObstruction,
  work
} from '@utils';
import { getRandomPoint } from '@utils/geometry';
import Worker from '@workers/maps?worker';
import { Pathfinding } from 'malwoden';

export interface ChunkOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
}

export interface SavedChunk {
  options: Pick<ChunkOptions, Exclude<keyof ChunkOptions, 'game'>>;
  cells: string[];
  entities: string[];
}

const prefabs = [
  ...prefabbed.weapons,
  ...prefabbed.items,
  ...prefabbed.consumables
];

export class Chunk {
  public toJSON(): SavedChunk {
    const cells = Array.from(this.cells.values()).map(cell => cell.id);
    const entities = this.entities.map(entity => entity.id);
    return {
      options: { ...this.point, ...this.size },
      cells,
      entities
    };
  }

  public paths: Pathfinding.AStar;
  public tints: Vector2Array<Color>;
  public tiles: Vector2Array<GameTileData>;
  public lights: Vector2Array<Color>;
  public bounds: Rectangle;
  public entities: Entity[] = [];
  public cells: Vector2Array<InstanceType<typeof Cell>>;

  /**
   * Chunk coordinate (e.g., 1, 2)
   */
  protected point: Vector2;
  protected size: { width: number; height: number };
  protected game: Game;

  protected get seed(): string {
    return `${this.point.x},${this.point.y}`;
  }

  public get x(): number {
    return this.point.x;
  }

  public get y(): number {
    return this.point.y;
  }

  public update(): void {
    for (const [point, entity] of this.cells.entries()) {
      entity.$.sprite.tint = this.tints.get(point) ?? AMBIENT_DARK;
    }
  }

  public unload(): void {
    for (const cell of this.cells.values()) {
      cell.tags.add(Tag.TO_DESTROY);
    }
    for (const e of this.entities) {
      e.tags.add(
        e.is(Tag.IS_IMPERMANENT)
          ? // flag stateless entities for destruction
            Tag.TO_DESTROY
          : // mark stateful entities inactive, but don't destroy
            Tag.IS_INACTIVE
      );
    }
    this.entities = [];
    this.cells = new Vector2Array(this.size);
  }

  public getSpawn(): Vector2 {
    const { width, height } = this.bounds;
    const max = width * height;

    let i = 0;
    let point: Vector2 | null = null;
    do {
      point = getRandomPoint(this.bounds);
      if (!this.collisions.isObstacle(point)) {
        return point;
      } else {
        point = null;
      }
    } while (point === null && i++ < max);

    return this.bounds.center;
  }

  public create(): void {
    for (const [point, type] of this.tiles.entries()) {
      const entity = this.game.ctx.create(
        Cell,
        {
          position: {
            x: this.x * CHUNK_WIDTH + point.x,
            y: this.y * CHUNK_HEIGHT + point.y
          },
          collision: { value: type.collision },
          render: { dirty: true },
          sprite: {
            key: type.spriteKey,
            tint: this.tints.get(point, AMBIENT_LIGHT)
          }
        },
        [Tag.IS_IMPERMANENT]
      );
      this.cells.set(point, entity);
    }
  }

  public toString(): string {
    return this.tiles.toString();
  }

  public async generate(
    builder: keyof typeof Builders = 'Empty'
  ): Promise<this> {
    const worker = work(new Worker());
    const baseX = this.point.x * CHUNK_WIDTH;
    const baseY = this.point.y * CHUNK_HEIGHT;

    const data = await worker.run<GeneratorPayload, GeneratorResponse>({
      x: this.point.x,
      y: this.point.y,
      width: CHUNK_WIDTH,
      height: CHUNK_HEIGHT,
      seed: this.seed,
      builder
    });

    this.tiles = new Vector2Array(this.size);

    for (const [point, type] of data.tiles) {
      // @todo - move elsewhere
      this.tiles.set(point, type);
    }

    for (const [point, color] of data.lights) {
      this.lights.set(point, color);
    }

    for (const [point, color] of data.tints) {
      this.tints.set(point, color);
    }

    for (const prefab of data.prefabs) {
      const found = prefabs.find(p => p.entity.id === prefab.entity.id);
      if (found) {
        const data = (prefab.data ?? {}) as any;

        this.entities.push(
          //  @todo: make sure we aren't double-spawning prefabs
          this.game.ctx.create(
            found.entity,
            {
              ...data,
              position: {
                x: baseX + data.position.x,
                y: baseY + data.position.y
              }
            },
            prefab.tags
          )
        );
      }
    }

    return this;
  }

  public collisions = {
    isObstacle: (point: Vector2): boolean =>
      isObstacle(this.tiles.get(point)?.collision),
    isObstruction: (point: Vector2): boolean =>
      isObstruction(this.tiles.get(point)?.collision)
  };

  public constructor({ x, y, width, height, game }: ChunkOptions) {
    this.size = { width, height };
    this.point = { x, y };
    this.game = game;

    this.tiles = new Vector2Array(this.size);
    this.tints = new Vector2Array(this.size);
    this.lights = new Vector2Array(this.size);
    this.cells = new Vector2Array(this.size);
    this.bounds = new Rectangle({ x1: 0, x2: width, y1: 0, y2: height });

    this.paths = new Pathfinding.AStar({
      isBlockedCallback: this.collisions.isObstruction,
      topology: 'four'
    });
  }
}
