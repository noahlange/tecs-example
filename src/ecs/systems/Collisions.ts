import type { CollisionMap } from '../../lib/CollisionMap';

import { System } from 'tecs';
import { Position, Actor, Collision, Interactive } from '../components';
import { getNewDirection, Action } from '@utils';

export class Collisions extends System {
  public static type = 'collisions';

  protected collisions!: CollisionMap;

  protected $ = {
    movers: this.world.query.components(Actor, Position).persist(),
    cells: this.world.query.components(Collision, Position).persist(),
    collisions: this.world.query
      .components(Collision, Position, Interactive)
      .persist()
  };

  protected updateDynamicCollisions(): void {
    for (const entity of this.$.collisions) {
      this.collisions.set(
        entity.$.position,
        entity.$.collision.passable,
        entity.$.collision.allowLOS
      );
    }
  }

  protected updateStaticCollisions(): void {
    for (const e of this.$.cells) {
      const c = e.$.collision as Collision;
      this.collisions.set(e.$.position as Position, c.passable, c.allowLOS);
    }
  }

  public tick(): void {
    this.updateDynamicCollisions();
    for (const { $ } of this.$.movers) {
      switch ($.action.data.id) {
        case Action.MOVE: {
          $.position.d = getNewDirection($.action.data.delta) ?? $.position.d;
          const { x: dx, y: dy } = $.action.data.delta;
          const next = { x: $.position.x + dx, y: $.position.y + dy };
          if (!this.collisions.isPassable(next)) {
            $.action.data = { id: Action.NONE };
          }
        }
      }
    }
  }

  public init(): void {
    this.collisions = this.world.game.$.map.collisions;
  }
}
