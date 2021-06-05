import type { Vector2 } from '@lib/types';

import {
  AreaOfEffect,
  IsEquipment,
  Overlay,
  Pathfinder,
  Position
} from '@core/components';
import { Tag } from '@lib/enums';
import { contains } from '@utils/geometry';
import { Entity, System } from 'tecs';

const E = Entity.with(Overlay, Position);

export class OverlaySystem extends System {
  public static readonly type = 'overlays';

  protected player: any | null = null;

  protected get viewshed(): Vector2[] {
    return this.player?.$.view.visible ?? [];
  }

  protected $ = {
    paths: this.ctx.$.components(Pathfinder).persist(),
    aoe: this.ctx.$.components(Position, IsEquipment, AreaOfEffect)
      .none.tags(Tag.TO_DESTROY)
      .persist()
  };

  protected drawAOE(): void {
    const collisions = this.ctx.game.$.map.collisions;
    for (const aoe of this.$.aoe) {
      const fov = this.viewshed;
      const cells = aoe.$.aoe.all(aoe.$.position);

      // filter out points we cannot see or touch
      const visible = cells
        .filter(point => collisions.isObstacle(point))
        .filter(f => contains(f, fov));

      if (visible.length) {
        this.ctx.create(E, {
          position: { x: 0, y: 0 },
          overlay: {
            color: { r: 255, g: 0, b: 0, a: 0.125 },
            tiles: visible.map(position => ({
              texture: 'red',
              position
            }))
          }
        });
      }
    }
  }

  protected drawPaths(): void {
    for (const { $ } of this.$.paths) {
      if (!$.pathfinder.destination || !$.pathfinder.path.length) {
        continue;
      }
      this.ctx.create(E, {
        position: { x: 0, y: 0 },
        overlay: {
          color: { r: 255, g: 0, b: 0, a: 0.25 },
          tiles: $.pathfinder.path.map(position => ({
            texture: 'red',
            position
          }))
        }
      });
    }
  }

  // protected drawHealth(): void {
  //   for (const entity of this.$.stats) {
  //     const sprites = entity.$.stats.health.sprites;
  //     const x = -(sprites.length * TILE_WIDTH - TILE_WIDTH) / 2;
  //     this.ctx.create(E, {
  //       position: { x, y: 0 },
  //       overlay: {
  //         color: { r: 255, g: 0, b: 0, a: 1 },
  //         tiles: sprites.map((texture, i) => ({
  //           texture,
  //           position: { x: i, y: 0 }
  //         }))
  //       }
  //     });
  //   }
  // }

  public tick(): void {
    this.drawAOE();
    // this.drawPaths();
  }

  public start(): void {}
}
