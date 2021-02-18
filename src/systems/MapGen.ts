import type { Point } from '../types';

import { WIDTH, HEIGHT } from '../utils';

import { System } from 'tecs';
import * as entities from '../entities';
import { T } from '../utils/tiles';

export class MapGen extends System {
  public static worker = new Worker(
    new URL('../workers/map/index.ts', import.meta.url)
  );

  public entities = entities;

  protected addCell(point: Point, isWall: boolean): void {
    this.world.create(entities.Cell, {
      position: point,
      collision: { passable: !isWall, allowLOS: !isWall },
      glyph: { text: isWall ? T.WALL : T.SPACE, fg: null }
    });
  }

  public async generate(): Promise<any> {
    return new Promise((resolve, reject) => {
      MapGen.worker.postMessage([WIDTH, HEIGHT]);
      MapGen.worker.onmessage = res => resolve(res.data);
      MapGen.worker.onerror = reject;
    });
  }

  public async init(): Promise<void> {
    const items = await this.generate();
    for (const item of items) {
      // @ts-ignore
      const Entity = this.entities[item.entity];
      if (Entity) {
        this.world.create(Entity, item.data);
      }
    }
  }
}
