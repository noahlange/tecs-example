import type { Context } from 'tecs';

import {
  Actor,
  Pathfinder,
  Playable,
  Position,
  Tweened
} from '@core/components';
import { Player } from '@core/entities';
import { Action } from '@lib/enums';
import { getRelativeDirection } from '@utils/geometry';

export function Movement(ctx: Context): void {
  const $ = {
    player: ctx.$.entities(Player),
    movers: ctx.$.components(Actor, Position)
      .some.components(Pathfinder, Playable, Tweened)
      .persist()
  };

  if (ctx.game.paused) {
    return;
  }

  for (const entity of $.movers) {
    const { $ } = entity;
    switch ($.action.data.id) {
      case Action.MOVE: {
        const { delta } = $.action.data;

        $.position.d = getRelativeDirection($.position, {
          x: $.position.x + delta.x,
          y: $.position.y + delta.y
        });

        // if we're tweening, wait until we've stopped moving before updating the position
        if (!$.tween?.active) {
          $.position.x += delta.x;
          $.position.y += delta.y;
        }

        break;
      }
      default:
        break;
    }
  }
}
