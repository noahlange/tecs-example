import { Action } from '@lib/enums';
import { contains, getInteractionPos } from '@utils/geometry';
import { System } from 'tecs';

import { Actor, Interactive, Position } from '../components';
import { Chest, Door } from '../entities';

export class Interact extends System {
  public static readonly type = 'interact';

  protected $ = {
    interactives: this.ctx.$.components(Position, Interactive).persist(),
    actors: this.ctx.$.components(Actor, Position).persist()
  };

  public tick(): void {
    const interactives = new Set(this.$.interactives);

    for (const actor of this.$.actors) {
      switch (actor.$.action.data.id) {
        case Action.INTERACT: {
          const pos = getInteractionPos(actor.$.position);
          for (const interactive of interactives) {
            // either their current position or the one they're pointing to
            if (contains(interactive.$.position, [actor.$.position, pos])) {
              if (interactive instanceof Door || interactive instanceof Chest) {
                interactive.interact();
                interactives.delete(interactive);
                actor.$.action.data = { id: Action.NONE };
              }
            }
          }
          break;
        }
      }
    }
  }
}
