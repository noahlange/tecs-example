import type { CollisionMethods } from '@lib/types';

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
          // we want to update the direction independently of whether or not
          // the mob actually moves
          $.position.d = getNewDirection($.action.data.delta) ?? $.position.d;
          if (
            this.collisions.isObstacle({
              x: $.position.x + $.action.data.delta.x,
              y: $.position.y + $.action.data.delta.y
            })
          ) {
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
