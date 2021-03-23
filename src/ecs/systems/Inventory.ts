import type { EntityType } from 'tecs';
import { System } from 'tecs';
import { Action } from '@utils';
import {
  Actor,
  Equipped,
  Inventory as InventoryComponent,
  Position,
  Renderable,
  Sprite,
  Stats
} from '../components';

import type {
  ConsumableItem,
  EquipEntity,
  EquippableItem,
  InventoryEntity,
  InventoryItem
} from '../entities/types';

import { Tag, EffectType } from '@enums';
import { hasStats, hasEquip, isConsumable, isEquippable } from '@utils';

export class Inventory extends System {
  public static readonly type = 'inventory';

  protected $ = {
    hasInventory: this.world.query
      .components(Actor, InventoryComponent, Position, Equipped)
      .some.components(Stats, Sprite, Renderable)
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
    for (const effect of item.$.effects) {
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
        case Action.ITEM_DROP: {
          const { target } = $.action.data;
          target.components.add(Position, { ...$.position });
          break;
        }

        case Action.ITEM_UNEQUIP:
        case Action.ITEM_EQUIP: {
          const { target } = $.action.data;
          if (hasEquip(entity) && isEquippable(target)) {
            if ($.action.data.id === Action.ITEM_EQUIP) {
              this.equipItem(entity, target);
            } else {
              this.unequipItem(entity, target);
            }
          }
          break;
        }

        // use or equip item
        case Action.ITEM_USE: {
          const { target } = $.action.data;
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
