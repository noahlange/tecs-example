import type {
  ConsumableItem,
  EquipEntity,
  EquippableItem,
  InventoryEntity,
  InventoryItem
} from '../entities/types';
import type { EntityType } from 'tecs';

import { Action, EffectType, Tag } from '@lib/enums';
import { contains, getInteractionPos } from '@utils/geometry';
import { System } from 'tecs';

import { Equippable, Stats } from '../components';
import {
  Actor,
  Equipped,
  Inventory as InventoryComponent,
  Item,
  Position,
  Text
} from '../components';

export class Inventory extends System {
  public static readonly type = 'inventory';

  protected $ = {
    items: this.world.query.components(Item, Position, Text).persist(),
    hasInventory: this.world.query
      .components(Actor, InventoryComponent, Position, Equipped)
      .persist()
  };

  protected addItem(entity: InventoryEntity, item: InventoryItem): void {
    item.components.remove(Position);
    item.tags.add(Tag.TO_DESTROY, Tag.IN_INVENTORY);

    const id = item.$.item.id;
    const exists = entity.$.inventory.items.find(i => i.$.item.id === id);

    if (exists) {
      exists.$.item.count += 1;
    } else {
      entity.$.inventory.items.push(item);
    }

    this.world.game.log(
      entity.$.action.data.count
        ? `Added ${item.$.text.title} (${entity.$.action.data.count})`
        : `Added ${item.$.text.title}`
    );

    entity.$.action.data = { id: Action.NONE };
  }

  protected unequipItem(entity: EquipEntity, item: EquippableItem): void {
    const slot = item.$.equip.slot;
    const equipped = entity.$.equipped.slots[slot];
    if (equipped) {
      equipped.$.equip.isEquipped = false;
      entity.$.equipped.slots[slot] = null;
    }
    entity.$.action.data = { id: Action.NONE };
  }

  protected equipItem(entity: EquipEntity, item: EquippableItem): void {
    const slot = item.$.equip.slot;
    const equipped = entity.$.equipped.slots[slot];

    // if we already have something equipped, unequip it
    if (equipped) {
      equipped.$.equip.isEquipped = false;
      entity.$.equipped.slots[slot] = null;
    }
    if (item.$.equip.sprite && entity.$.sprite) {
      const pixi = entity.$.sprite.pixi;
      // @todo - abstract
      pixi?.destroy();
      entity.$.sprite.key = item.$.equip.sprite;
      entity.$.sprite.pixi = null;
    }
    // equip the new item
    item.$.equip.isEquipped = true;
    entity.$.equipped.slots[slot] = item;
    entity.$.action.data = { id: Action.NONE };
  }

  protected consumeItem(
    { $ }: InventoryEntity & EntityType<[typeof Stats]>,
    item: ConsumableItem
  ): void {
    // consumable, apply effects
    for (const effect of item.$.effects ?? []) {
      switch (effect.type) {
        case EffectType.HP_ADD:
          $.stats.health.value += effect.value;
          break;
        case EffectType.HP_MAX: {
          const isMax = $.stats.health.max === $.stats.health.value;
          $.stats.health.max += effect.value;
          if (isMax) {
            $.stats.health.value = $.stats.health.max;
          }
          break;
        }
      }
    }

    // decrement count if >1 exists, otherwise remove it
    if (item.$.item.count > 1) {
      item.$.item.count--;
    } else {
      item.tags.remove(Tag.IN_INVENTORY);
      item.destroy();
    }

    $.action.data = { id: Action.NONE };
  }

  public tick(): void {
    const items = new Set(this.$.items);
    for (const entity of this.$.hasInventory) {
      const { $ } = entity;
      const pos = getInteractionPos($.position);

      // perform action...
      switch ($.action.data.id) {
        // add item to inventory
        case Action.INTERACT:
        case Action.ITEM_PICK_UP: {
          for (const item of items) {
            if (contains(item.$.position, [$.position, pos])) {
              this.addItem(entity, item);
            }
          }
          break;
        }
        // drop item on the ground
        case Action.ITEM_DROP: {
          const { target } = $.action.data;
          target.components.add(Position, { ...$.position });
          break;
        }
        case Action.ITEM_UNEQUIP:
        case Action.ITEM_EQUIP: {
          const { target } = $.action.data;
          if (
            entity.has(Equipped) &&
            target.has(Equippable) &&
            target.is(Tag.IS_EQUIPPABLE)
          ) {
            $.action.data.id === Action.ITEM_EQUIP
              ? this.equipItem(entity, target)
              : this.unequipItem(entity, target);
          }
          break;
        }
        // use or equip item
        case Action.ITEM_USE: {
          const { target } = $.action.data;
          if (entity.has(Stats) && target.is(Tag.IS_CONSUMABLE)) {
            this.consumeItem(entity, target);
          }
          break;
        }
      }

      $.inventory.items = $.inventory.items.filter(item =>
        item.is(Tag.IN_INVENTORY)
      );
    }
  }
}
