import type { InventoryEntity, InventoryItem } from '@game/entities/types';
import type { Context } from 'tecs';

import {
  Actor,
  HasEquipment,
  Inventory,
  IsEquipment,
  Item,
  Position,
  Sprite,
  Text
} from '@core/components';
import { Stats } from '@game/components';
import { EffectType } from '@game/enums';

export function applyEffect(
  entity: InventoryEntity,
  type: EffectType,
  value: number
): void {
  const { $ } = entity;
  switch (type) {
    case EffectType.HP_ADD:
      $.stats.health.value += value;
      break;
    case EffectType.HP_MAX: {
      const isMax = $.stats.health.max === $.stats.health.value;
      $.stats.health.max += value;
      if (isMax) {
        $.stats.health.value = $.stats.health.max;
      }
      break;
    }
  }
}

export function queryInventoryItems(ctx: Context): Iterable<InventoryItem> {
  return ctx.$.components(Item, Text, IsEquipment)
    .some.components(Position)
    .persist();
}

export function queryInventoryEntities(
  ctx: Context
): Iterable<InventoryEntity> {
  return ctx.$.components(Actor, Inventory, Position, HasEquipment, Stats)
    .some.components(Sprite)
    .persist();
}
