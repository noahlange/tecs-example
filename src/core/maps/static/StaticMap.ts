import type { Game } from '@core';
import type { GameTileData } from '@lib';
import type { CollisionMethods, Vector2 } from '@lib/types';
import type { Entity } from 'tecs';

import { Cell } from '@core/entities';
import { Vector2Array } from '@lib';
import { Collision } from '@lib/enums';
import { Tiled } from '@lib/Tiled';
import { isObstacle, isObstruction } from '@utils';

import { WorldMap } from '../lib/WorldMap';

export interface StaticMapOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  map: string;
}

export class StaticMap extends WorldMap {
  protected tiles: Vector2Array<GameTileData>;
  protected options: StaticMapOptions;

  public getSpawn(): Vector2 {
    return { x: 0, y: 0 };
  }

  public collisions: CollisionMethods = {
    isObstacle: (point: Vector2): boolean =>
      isObstacle(this.tiles.get(point)?.collision),
    isObstruction: (point: Vector2): boolean =>
      isObstruction(this.tiles.get(point)?.collision),
    set: (point: Vector2, isObstacle: boolean, isObstruction: boolean) => {
      const tile = this.tiles.get(point, {});
      this.tiles.set(point, {
        ...tile,
        collision:
          (isObstacle ? Collision.OBSTACLE : Collision.NONE) +
          (isObstruction ? Collision.OBSTRUCTION : Collision.NONE)
      });
    }
  };

  protected entities: Entity[] = [];

  public set center(next: Vector2) {}

  public async generate(): Promise<void> {
    const tilemap = await Tiled.from(this.options.map);
    // set projection (iso/ortho)
    this.projection = tilemap.projection;
    // @todo - load tile props
    this.entities = Array.from(tilemap).map(([point, sprite]) => {
      this.tiles.set(point, { spriteKey: sprite, collision: Collision.NONE });
      return this.game.ecs.create(Cell, {
        sprite: { key: sprite },
        collision: { value: Collision.NONE },
        position: point
      });
    });

    this.game.$.renderer.loadSpritesheets(await tilemap.getSpritesheets());
    this.game.emit('init.map.static', this);
  }

  public constructor(game: Game, options: StaticMapOptions) {
    super(game, options);
    this.options = options;
    this.tiles = new Vector2Array(options);
  }
}
