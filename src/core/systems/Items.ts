import type { Context } from 'tecs';

import { Action } from '@lib/enums';
import { contains, getInteractionPos } from '@utils/geometry';

import {
  Actor,
  Equippable,
  Inventory,
  Item,
  Position,
  Text
} from '../components';

export function Items(ctx: Context): void {
  const items = new Set(
    ctx.$.components(Position, Item, Text).some.components(Equippable)
  );

  for (const actor of ctx.$.components(Actor, Position, Inventory)) {
    switch (actor.$.action.data.id) {
      case Action.ITEM_DROP: {
        break;
      }
      case Action.INTERACT: {
        const pos = getInteractionPos(actor.$.position);
        for (const item of items) {
          if (
            contains(item.$.position, [actor.$.position, pos]) &&
            item.has(Equippable)
          ) {
            // if it's an item, add to our inventory
            items.delete(item);
            actor.$.action.data = {
              id: Action.ITEM_PICK_UP,
              count: item.$.item.count,
              actor: actor,
              target: item
            };
            break;
          }
        }
      }
    }
  }
}
