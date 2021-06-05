import type { UnwrapIterable } from './types';
import type { AreaOfEffect, IsEquipment } from '@core/components';
import type { Usable } from '@core/components/Usable';
import type { Attack } from '@core/entities';
import type { GameAction, GameActionType } from '@game/utils';
import type {
  queryInventoryEntities,
  queryInventoryItems
} from '@game/utils/inventory';
import type { Action } from '@lib/enums';
import type { Vector2 } from '@lib/types';
import type { EntityType } from 'tecs';

type InventoryItem = UnwrapIterable<ReturnType<typeof queryInventoryItems>>;
type InventoryEntity = UnwrapIterable<
  ReturnType<typeof queryInventoryEntities>
>;

export interface ActionItem {
  id: Action | GameAction;
  [key: string]: unknown;
}

export interface MoveAction extends ActionItem {
  id: Action.MOVE;
  delta: Vector2;
  point?: Vector2;
}

export interface CombatAttackAction extends ActionItem {
  id: Action.COMBAT_ATTACK;
  target: Vector2;
  attack: EntityType<[typeof AreaOfEffect, typeof IsEquipment, typeof Usable]>;
}

export interface DestinationAction extends ActionItem {
  id: Action.SET_DESTINATION;
  target: Vector2;
  isActive?: boolean;
  isVisible?: boolean;
}

export interface CombatDefendAction extends ActionItem {
  id: Action.COMBAT_DEFEND;
}

export interface InteractAction extends ActionItem {
  id: Action.INTERACT;
  target: string | null;
}

export interface VoidAction extends ActionItem {
  id: Action.NONE;
}

export interface MenuNavigateAction extends ActionItem {
  id: Action.MENU_NAVIGATE;
  key: string;
}

export interface PickUpAction extends ActionItem {
  id: Action.ITEM_PICK_UP;
  count?: number;
  target: InventoryItem;
}

export interface DiscardAction extends ActionItem {
  id: Action.ITEM_DROP;
  count?: number;
  target: InventoryItem;
}

export interface UseAction extends ActionItem {
  id: Action.ITEM_USE;
  target: InventoryItem;
}

export interface EquipAction extends ActionItem {
  id: Action.ITEM_EQUIP;
  target: InventoryItem;
  actor: InventoryEntity;
}

export interface UnequipAction extends ActionItem {
  id: Action.ITEM_UNEQUIP;
  target: InventoryItem;
  actor: InventoryEntity;
}

export interface CombatAttackPaused extends ActionItem {
  id: Action.COMBAT_ATTACK_PAUSED;
  attack: InstanceType<typeof Attack>;
}

export interface TogglePauseAction extends ActionItem {
  id: Action.TOGGLE_PAUSE;
}

export type ActionType =
  | PickUpAction
  | MoveAction
  | DestinationAction
  | VoidAction
  | InteractAction
  | DiscardAction
  | MenuNavigateAction
  | UseAction
  | CombatAttackAction
  | CombatDefendAction
  | CombatAttackPaused
  | EquipAction
  | UnequipAction
  | MoveAction
  | DestinationAction
  | VoidAction
  | InteractAction
  | MenuNavigateAction
  | MoveAction
  | DestinationAction
  | VoidAction
  | InteractAction
  | MenuNavigateAction
  | TogglePauseAction
  | GameActionType;
