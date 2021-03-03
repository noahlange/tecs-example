import { System } from 'tecs';

import { Position, Actor, Pathfinder } from '../components';
import { Action } from '@utils';

export class Movement extends System {
  public static type = 'movement';

  protected queries = {
    movers: this.world.query
      .components(Actor, Position)
      .some.components(Pathfinder)
      .persist()
  };

  public tick(): void {
    if (this.world.game.paused) {
      return;
    }

    const movers = Array.from(this.queries.movers).filter(
      ({ $ }) => $.action.data.id === Action.MOVE
    );

    for (const { $ } of movers) {
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
