import {
  AreaOfEffect,
  Equippable,
  Position,
  Overlay,
  Stats,
  Playable,
  Pathfinder
} from '@ecs/components';
import type { Vector2 } from '@types';

import { isWithin, TILE_WIDTH } from '@utils';
import { Tag } from '@enums';

import { Entity, System } from 'tecs';
import { Player } from '@ecs/entities';

const E = Entity.with(Overlay, Position);

export class Overlays extends System {
  public static readonly type = 'overlays';

  protected player: Player | null = null;

  protected get viewshed(): Vector2[] {
    return this.player?.$.view.visible ?? [];
  }

  protected $ = {
    paths: this.world.query.components(Pathfinder).persist(),
    aoe: this.world.query
      .components(Position, Equippable, AreaOfEffect)
      .none.tags(Tag.TO_DESTROY)
      .persist(),
    stats: this.world.query
      .components(Position, Stats)
      .none.components(Playable)
      .persist()
  };

  protected drawAOE(): void {
    const collisions = this.world.game.$.map.collisions;
    for (const aoe of this.$.aoe) {
      const fov = this.viewshed;
      const cells = aoe.$.aoe.all(aoe.$.position);

      // filter out points we cannot see or touch
      const visible = cells
        .filter(point => collisions.isPassable(point))
        .filter(f => isWithin(f, fov));

      if (visible.length) {
        this.world.create(E, {
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
      this.world.create(E, {
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

  protected drawHealth(): void {
    for (const entity of this.$.stats) {
      const sprites = entity.$.stats.health.sprites;
      const x = -(sprites.length * TILE_WIDTH - TILE_WIDTH) / 2;
      this.world.create(E, {
        position: { x, y: 0 },
        overlay: {
          color: { r: 255, g: 0, b: 0, a: 1 },
          tiles: sprites.map((texture, i) => ({
            texture,
            position: { x: i, y: 0 }
          }))
        }
      });
    }
  }

  public tick(): void {
    this.drawAOE();
    this.drawHealth();
    // this.drawPaths();
  }

  public init(): void {
    this.player = this.world.query.entities(Player).first();
  }
}
