import { Player } from '@core/entities';
import { Action } from '@lib/enums';
import { getRelativeDirection } from '@utils/geometry';
import { System } from 'tecs';

import { Actor, Pathfinder, Playable, Position, Tweened } from '../components';

export class Movement extends System {
  public static type = 'movement';

  protected $ = {
    player: this.world.query.entities(Player),
    movers: this.world.query
      .components(Actor, Position)
      .some.components(Pathfinder, Playable, Tweened)
      .persist()
  };

  public tick(): void {
    if (this.world.game.paused) {
      return;
    }

    for (const entity of this.$.movers) {
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
}
