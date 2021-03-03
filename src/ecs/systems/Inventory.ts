import type { EntityType } from 'tecs';
import { System } from 'tecs';
import { Action } from '@utils';
import {
  Actor,
  Equipped,
  Inventory as InventoryComponent,
  Position,
  Stats
} from '../components';

import type {
  ConsumableItem,
  EquippableItem,
  InventoryEntity,
  InventoryItem
} from '../entities/types';

import { Tag, EffectType } from '@utils/enums';
import { hasStats, hasEquip, isConsumable, isEquippable } from '@utils';

export class Inventory extends System {
  public static readonly type = 'inventory';

  protected $ = {
    hasInventory: this.world.query
      .components(Actor, InventoryComponent, Position)
      .some.components(Stats, Equipped)
      .persist()
  };

  protected addItem(entity: InventoryEntity, item: InventoryItem): void {
    item.components.remove(Position);
    item.tags.add(Tag.TO_UNRENDER, Tag.IN_INVENTORY);

    const exists = entity.$.inventory.items.find(
      i => i.$.text.title === item.$.text.title
    );

    if (exists) {
      exists.$.item.count += 1;
    } else {
      entity.$.inventory.items.push(item);
    }

    this.world.game.$.messages.add({
      text: entity.$.action.data.count
        ? `Added ${item.$.text.title} (${entity.$.action.data.count})`
        : `Added ${item.$.text.title}`
    });

    entity.$.action.data = { id: Action.NONE };
  }

  protected equipItem(
    entity: InventoryEntity & EntityType<[typeof Equipped]>,
    item: EquippableItem
  ): void {
    const slot = item.$.equip.slot;
    const equipped = entity.$.equipped.slots[slot];
    // if we already have something equipped, unequip it
    if (equipped !== null) {
      equipped.$.equip.isEquipped = false;
    }

    item.$.equip.isEquipped = true;
    entity.$.equipped.slots[slot] = item;
    entity.$.action.data = { id: Action.NONE };
  }

  protected consumeItem(
    { $ }: InventoryEntity & EntityType<[typeof Stats]>,
    item: ConsumableItem
  ): void {
    // consumable, apply effects
    for (const effect of item.$.effects) {
      switch (effect.type) {
        case EffectType.HP_ADD:
          $.stats.hp = Math.min($.stats.hpMax, $.stats.hp + effect.value);
          break;
        case EffectType.HP_MAX: {
          const isMax = $.stats.hp === $.stats.hpMax;
          $.stats.hpMax += effect.value;
          if (isMax) {
            $.stats.hp = $.stats.hpMax;
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
    for (const entity of this.$.hasInventory) {
      const { $ } = entity;

      // perform action...
      switch ($.action.data.id) {
        // add item to inventory
        case Action.ITEM_PICK_UP: {
          this.addItem(entity, $.action.data.target);
          break;
        }

        // drop item on the ground
        case Action.ITEM_DISCARD: {
          const { target } = $.action.data;
          target.components.add(Position, { ...$.position });
          break;
        }

        // use or equip item
        case Action.ITEM_USE: {
          const { target } = $.action.data;
          if (hasEquip(entity) && isEquippable(target)) {
            this.equipItem(entity, target);
          }
          // TS is treating the type guards strangely...
          if (hasStats(entity!) && isConsumable(target)) {
            this.consumeItem(entity, target);
          }
          break;
        }
      }

      $.inventory.items = $.inventory.items.filter(item =>
        item.tags.has(Tag.IN_INVENTORY)
      );
    }
  }
}
