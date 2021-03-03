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
  Equipped
} from '../components';

export type InventoryEntity = EntityType<
  [typeof Actor, typeof Inventory, typeof Position]
>;

export type EquippableItem = EntityType<
  [typeof Item, typeof Text, typeof Equippable]
>;

export type ConsumableItem = EntityType<
  [typeof Item, typeof Text, typeof Effects]
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
