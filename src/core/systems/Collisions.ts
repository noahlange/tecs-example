import type { CollisionMethods } from '../../lib/types';

import { Action } from '@lib/enums';
import { getNewDirection } from '@utils/geometry';
import { System } from 'tecs';

import { Actor, Collision, Interactive, Position } from '../components';

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
    for (const { $ } of this.$.colliders) {
      this.collisions.set(
        $.position,
        $.collision.isObstacle,
        $.collision.isObstruction
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
          if (this.collisions.isObstacle(next)) {
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
