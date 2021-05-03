import type { CollisionMethods, Vector2 } from '../../../lib/types';
import type { Game } from '@core';
import type { GameTileData } from '@lib';
import type { GeneratorPayload, GeneratorResponse } from '@workers/maps';
import type { Entity } from 'tecs';

import { Vector2Array } from '@lib';
import { Collision } from '@lib/enums';
import { isObstacle, isObstruction, work } from '@utils';
import Worker from '@workers/maps?worker';

import { WorldMap } from './WorldMap';

interface StaticMapOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class StaticMap extends WorldMap {
  protected tiles: Vector2Array<GameTileData>;

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

  public set center(next: Vector2) {
    // this.generate();
  }

  public async generate(): Promise<void> {
    const worker = work(new Worker());

    const data = await worker.run<GeneratorPayload, GeneratorResponse>({
      x: this.point.x,
      y: this.point.y,
      width: this.width,
      height: this.height,
      seed: '',
      builder: 'Canyon'
    });

    // const sets = [tiledTiles] as TiledTileset[];
    // Object.assign(
    //   this.game.$.renderer.sheets,
    //   await getSpritesheetsFromTilesets(sets)
    // );

    this.tiles = Vector2Array.from(data.tiles);
    // this.entities = data.tiles.map(([position, data]) => {
    //   return this.game.ecs.create(Cell, {
    //     sprite: { key: data.spriteKey },
    //     collision: { value: data.collision },
    //     position
    //   });
    // });

    this.game.emit('init.map.static', this);
  }

  public constructor(game: Game, options: StaticMapOptions) {
    super(game, options);
    this.tiles = new Vector2Array(options);
    // this.generate();
  }
}
