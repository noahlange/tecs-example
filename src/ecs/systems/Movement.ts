import { System } from 'tecs';

import { Position, Actor, Pathfinder, Playable } from '../components';
import { Action } from '@utils';
import { Player } from '@ecs/entities';

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

    const movers = Array.from(this.$.movers).filter(
      ({ $ }) => $.action.data.id === Action.MOVE
    );

    for (const entity of movers) {
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
      }
    }
  }
}
