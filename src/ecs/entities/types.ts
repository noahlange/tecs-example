import type { EntityType } from 'tecs';
import type {
  Actor,
  Combatant,
  Effects,
  Equippable,
  Inventory,
  Item,
  Position,
  Text,
  Stats,
  Equipped,
  Sprite
} from '../components';

export type InventoryEntity = EntityType<
  [typeof Actor, typeof Inventory, typeof Position, typeof Equipped],
  [typeof Sprite]
>;

export type EquipEntity = EntityType<
  [typeof Actor, typeof Inventory, typeof Position, typeof Equipped],
  [typeof Sprite]
>;

export type ConsumableItem = EntityType<
  [typeof Item, typeof Text, typeof Effects],
  [typeof Sprite]
>;

export type EquippableItem = EntityType<
  [typeof Item, typeof Text, typeof Equippable],
  [typeof Effects, typeof Sprite]
>;

export type InventoryItem = EquippableItem | ConsumableItem;

export type CombatEntity = EntityType<
  [
    typeof Combatant,
    typeof Actor,
    typeof Stats,
    typeof Position,
    typeof Equipped,
    typeof Text
  ]
>;
