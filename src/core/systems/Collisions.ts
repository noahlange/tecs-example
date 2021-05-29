import type { Context } from 'tecs';

import { Action } from '@lib/enums';
import { getNewDirection } from '@utils/geometry';

import { Actor, Collision, Interactive, Position } from '../components';

export function Collisions(ctx: Context): void {
  const collisions = ctx.game.$.map.collisions;

  for (const { $ } of ctx.$.components(Collision, Position, Interactive)) {
    collisions.set(
      $.position,
      $.collision.isObstacle,
      $.collision.isObstruction
    );
  }

  for (const { $ } of ctx.$.components(Actor, Position)) {
    switch ($.action.data.id) {
      case Action.MOVE: {
        // we want to update the direction independently of whether or not
        // the mob actually moves
        $.position.d = getNewDirection($.action.data.delta) ?? $.position.d;
        if (
          collisions.isObstacle({
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
