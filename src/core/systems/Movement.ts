import { Player } from '@core/entities';
import { Action } from '@lib/enums';
import { System } from 'tecs';

import { Actor, Pathfinder, Playable, Position } from '../components';

export class Movement extends System {
  public static type = 'movement';

  protected $ = {
    player: this.world.query.entities(Player),
    movers: this.world.query
      .components(Actor, Position)
      .some.components(Pathfinder, Playable)
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

          $.position.x += delta.x;
          $.position.y += delta.y;
          $.action.data = { id: Action.NONE };

          if ($.pathfinder) {
            $.pathfinder.destination = null;
            $.pathfinder.path = [];
          }

          break;
        }
        default:
          break;
      }
    }
  }
}
