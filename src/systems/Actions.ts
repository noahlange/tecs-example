import { System } from 'tecs';

import {
  Glyph,
  Position,
  Interactive,
  Action,
  Text,
  Talk
} from '../components';
import { ID, UIMode } from '../types';
import { getInteractionPos, getNewDirection } from '../utils';
import { Core, Door, NPC, Chest } from '../entities';

export class Actions extends System {
  public static type = 'actions';

  public collisions: Record<string, boolean> = {};

  protected queries = {
    game: this.world.query.entities(Core),
    movables: this.world.query.components(Action, Position),
    mobs: this.world.query
      .components(Position, Interactive)
      .some.components(Glyph, Text, Talk)
  };

  public tick(): void {
    const game = this.queries.game.first();
    // bail if we're not in "interacting with the world" mode
    if (game?.$.game.mode === UIMode.DIALOGUE) {
      return;
    }
    const mobs = this.queries.mobs.get();

    for (const { $ } of this.queries.movables) {
      $.position.d = getNewDirection($.action.action) ?? $.position.d;
      const { x, y } = getInteractionPos($.position);

      const interactive = mobs
        .filter(({ $ }) => $.position.x === x && $.position.y === y)
        .shift();

      switch ($.action.action) {
        case ID.INTERACT: {
          if (
            interactive instanceof Door ||
            interactive instanceof NPC ||
            interactive instanceof Chest
          ) {
            interactive.interact();
          }
          // we did the thing
          $.action.action = ID.NONE;
          break;
        }
      }
    }
  }
}
