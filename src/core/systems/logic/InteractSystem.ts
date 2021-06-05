import type { Context } from 'tecs';

import { Actor, Interactive, Position } from '@core/components';
import { Chest, Door } from '@core/entities';
import { Action } from '@lib/enums';
import { contains, getInteractionPos } from '@utils/geometry';

export function InteractSystem(ctx: Context): void {
  const interactives = new Set(ctx.$.components(Position, Interactive));
  for (const actor of ctx.$.components(Actor, Position)) {
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
