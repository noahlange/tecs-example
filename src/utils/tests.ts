import type { EntityType } from 'tecs';
import type { Equipped, Stats } from '../ecs/components';
import type {
  ConsumableItem,
  EquippableItem,
  InventoryEntity,
  InventoryItem
} from '../ecs/entities/types';
import { Tag } from '../types';

export function isEquippable(item: InventoryItem): item is EquippableItem {
  return item.tags.has(Tag.IS_EQUIPPABLE);
}

export function isConsumable(item: InventoryItem): item is ConsumableItem {
  return item.tags.has(Tag.IS_CONSUMABLE);
}

export function hasEquip(
  entity: InventoryEntity & { $: { equipped?: Equipped } }
): entity is InventoryEntity & EntityType<[typeof Equipped]> {
  return !!entity.$.equipped;
}

export function hasStats(
  entity: InventoryEntity & { $: { stats?: Stats } }
): entity is InventoryEntity & EntityType<[typeof Stats]> {
  return !!entity.$.stats;
}
