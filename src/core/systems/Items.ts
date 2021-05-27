import { Action } from '@lib/enums';
import { contains, getInteractionPos } from '@utils/geometry';
import { System } from 'tecs';

import {
  Actor,
  Equippable,
  Inventory,
  Item,
  Position,
  Text
} from '../components';

export class Items extends System {
  public static readonly type = 'items';

  protected $ = {
    items: this.world.query
      .components(Position, Item, Text)
      .some.components(Equippable)
      .persist(),
    actors: this.world.query.components(Actor, Position, Inventory).persist()
  };

  public tick(): void {
    const items = new Set(this.$.items);
    for (const actor of this.$.actors) {
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
}
