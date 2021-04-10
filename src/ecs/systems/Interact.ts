import { System } from 'tecs';

import { Actor, Interactive, Position } from '../components';
import { Chest, Door } from '../entities';

import { getInteractionPos, isWithin, Action } from '@utils';

export class Interact extends System {
  public static readonly type = 'interact';

  protected $ = {
    interactives: this.world.query.components(Position, Interactive).persist(),
    actors: this.world.query.components(Actor, Position).persist()
  };

  public tick(): void {
    const interactives = new Set(this.$.interactives);

    for (const actor of this.$.actors) {
      switch (actor.$.action.data.id) {
        case Action.INTERACT: {
          const pos = getInteractionPos(actor.$.position);
          for (const interactive of interactives) {
            if (isWithin(interactive.$.position, [actor.$.position, pos])) {
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
