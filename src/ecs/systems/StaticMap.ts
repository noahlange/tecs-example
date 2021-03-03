import type { Point } from '@types';
import type { MapGenResult } from '../../workers/map/MapGen';
import type { Collision, Position } from '../components';

import { T, map } from '@utils';
import { System } from 'tecs';
import * as entities from '../entities';

export class StaticMap extends System {
  public static readonly type = 'map';
  public static worker = new Worker(
    new URL('../../workers/map/index.ts', import.meta.url)
  );

  protected entities = entities;

  protected addCell(point: Point, isWall: boolean): void {
    this.world.create(entities.Cell, {
      position: point,
      collision: { passable: !isWall, allowLOS: !isWall },
      sprite: { key: isWall ? 'wall_01_ew' : T.BLANK, tint: null }
    });
  }

  public async generate(): Promise<MapGenResult> {
    return new Promise((resolve, reject) => {
      StaticMap.worker.postMessage([map.w, map.h]);
      StaticMap.worker.onmessage = res => resolve(res.data);
      StaticMap.worker.onerror = reject;
    });
  }

  public async init(): Promise<void> {
    const collisions = this.world.game.$.map.collisions;

    const items = await this.generate();
    for (const item of items.entities) {
      // @ts-ignore
      const Entity = this.entities[item.entity];
      if (Entity) {
        const e = this.world.create(Entity, item.data, item.tags);
        if (e.$.position && e.$.collision) {
          const c = e.$.collision as Collision;
          collisions.set(e.$.position as Position, c.passable, c.allowLOS);
        }
      }
    }
  }
}
