import type { CollisionMethods } from '@lib';

import { System } from 'tecs';
import { Position, Actor, Collision, Interactive } from '../components';
import { getNewDirection, Action } from '@utils';

export class Collisions extends System {
  public static type = 'collisions';

  protected collisions!: CollisionMethods;

  protected $ = {
    movers: this.world.query.components(Actor, Position).persist(),
    cells: this.world.query.components(Collision, Position).persist(),
    colliders: this.world.query
      .components(Collision, Position, Interactive)
      .persist()
  };

  protected updateDynamicCollisions(): void {
    for (const entity of this.$.colliders) {
      this.collisions.set(
        entity.$.position,
        entity.$.collision.allowLOS,
        entity.$.collision.passable
      );
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
