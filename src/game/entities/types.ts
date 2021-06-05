import type {
  Actor,
  Combatant,
  Effects,
  HasEquipment,
  Inventory,
  IsEquipment,
  Item,
  Position,
  Sprite,
  Text
} from '@core/components';
import type { Stats } from '@game/components';
import type { EntityType } from 'tecs';

export type InventoryEntity = EntityType<
  [
    typeof Actor,
    typeof Inventory,
    typeof Position,
    typeof HasEquipment,
    typeof Stats
  ],
  [typeof Sprite]
>;

export type EquipEntity = EntityType<
  [typeof Actor, typeof Inventory, typeof Position, typeof HasEquipment],
  [typeof Sprite]
>;

export type ConsumableItem = EntityType<
  [typeof Item, typeof Text],
  [typeof Effects, typeof Sprite]
>;

export type InventoryItem = EntityType<
  [typeof Item, typeof Text, typeof IsEquipment],
  [typeof Effects, typeof Sprite, typeof Position]
>;

export type CombatEntity = EntityType<
  [
    typeof Combatant,
    typeof Actor,
    typeof Stats,
    typeof Position,
    typeof HasEquipment,
    typeof Text
  ]
>;
