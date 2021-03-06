import type { Game } from '@core';
import type { GameTileData } from '@lib';
import type { CollisionMethods, Vector2 } from '@lib/types';
import type { TiledMap } from '@utils/tiled';
import type { Entity } from 'tecs';

import { Cell } from '@core/entities';
import { Vector2Array } from '@lib';
import { Collision } from '@lib/enums';
import { Tiled } from '@lib/Tiled';
import { isObstacle, isObstruction } from '@utils';

import { WorldMap } from '../lib/WorldMap';

export class StaticMap extends WorldMap {
  protected tiles!: Vector2Array<GameTileData>;
  protected tiled: TiledMap;

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
    const tilemap = await Tiled.from(this.tiled);
    this.options.width = tilemap.width;
    this.options.height = tilemap.height;
    this.tiles = new Vector2Array(tilemap);
    // set projection (iso/ortho)
    this.projection = tilemap.projection;
    const entities = [];
    const collisions = tilemap.layers.find(layer => layer.name === 'collision');

    for (const [point, value] of collisions ?? []) {
      this.tiles.set(point, {
        // spriteKey: value,
        collision: (() => {
          switch (value) {
            case 'collision.000':
            case 'collision.001':
            case 'collision.002':
            case 'collision.003':
            case 'collision.004':
            case 'collision.005':
            case 'collision.006':
              return Collision.COMPLETE;
            default:
              return Collision.NONE;
          }
        })()
      });
    }

    for (const layer of tilemap.layers) {
      if (layer.name === 'collision') {
        continue;
      }
      for (const [position, key] of layer) {
        if (key) {
          entities.push(
            this.game.ctx.create(Cell, { sprite: { key }, position })
          );
        }
      }
    }

    this.game.$.renderer.loadSpritesheets(await tilemap.getSpritesheets());
    this.game.emit('init.map.static', this);
  }

  public constructor(game: Game, tiled: TiledMap) {
    super(game, { width: tiled.width, height: tiled.height, x: 0, y: 0 });
    this.tiled = tiled;
  }
}
