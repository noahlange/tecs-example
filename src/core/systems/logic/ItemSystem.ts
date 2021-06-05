import type { Context } from 'tecs';

import {
  Actor,
  Inventory,
  IsEquipment,
  Item,
  Position,
  Text
} from '@core/components';
import { Action } from '@lib/enums';
import { contains, getInteractionPos } from '@utils/geometry';

export function ItemSystem(ctx: Context): void {
  const items = new Set(
    ctx.$.components(Position, Item, Text).some.components(IsEquipment)
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
            item.has(IsEquipment)
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
