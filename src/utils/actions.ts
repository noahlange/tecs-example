import type { AreaOfEffect, Equippable } from '@ecs/components';
import type { Attack } from '@ecs/entities';
import type { InventoryEntity, InventoryItem } from '@ecs/entities/types';
import type { Vector2 } from '@types';
import type { EntityType } from 'tecs';

export enum Action {
  MENU_NAVIGATE = 'menu_navigate',
  NONE = 'none',
  INTERACT = 'interact',
  MOVE = 'move',
  SET_DESTINATION = 'set_destination',
  ITEM_PICK_UP = 'item_pick_up',
  ITEM_DROP = 'item_drop',
  ITEM_USE = 'item_use',
  ITEM_EQUIP = 'item_equip',
  ITEM_UNEQUIP = 'item_unequip',
  COMBAT_ATTACK = 'combat_attack',
  COMBAT_DEFEND = 'combat_defend',
  COMBAT_ATTACK_PAUSED = 'combat_attack_paused'
}

export interface ActionItem {
  id: Action;
  [key: string]: unknown;
}

export interface MoveAction extends ActionItem {
  id: Action.MOVE;
  delta: Vector2;
  point?: Vector2;
}

export interface DestinationAction extends ActionItem {
  id: Action.SET_DESTINATION;
  target: Vector2;
  isActive: boolean;
  isVisible: boolean;
}

export interface CombatAttackAction extends ActionItem {
  id: Action.COMBAT_ATTACK;
  target: Vector2;
  attack: EntityType<[typeof AreaOfEffect, typeof Equippable]>;
}

export interface CombatDefendAction extends ActionItem {
  id: Action.COMBAT_DEFEND;
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
  | UnequipAction;
