import type { AreaOfEffect, Equippable } from '@ecs/components';
import type { Attack } from '@ecs/entities';
import type { InventoryItem } from '@ecs/entities/types';
import type { Point } from '@types';
import type { EntityType } from 'tecs';

export enum Action {
  NONE = 'none',
  INTERACT = 'interact',
  MOVE = 'move',
  SET_DESTINATION = 'set_destination',
  ITEM_PICK_UP = 'item_pick_up',
  ITEM_USE = 'item_use',
  ITEM_DISCARD = 'item_discard',
  MENU_NAVIGATE = 'menu_navigate',
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
  delta: Point;
  point?: Point;
}

export interface DestinationAction extends ActionItem {
  id: Action.SET_DESTINATION;
  target: Point;
  isActive: boolean;
  isVisible: boolean;
}

export interface CombatAttackAction extends ActionItem {
  id: Action.COMBAT_ATTACK;
  target: Point;
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
  id: Action.ITEM_DISCARD;
  count?: number;
  target: InventoryItem;
}
export interface UseAction extends ActionItem {
  id: Action.ITEM_USE;
  target: InventoryItem;
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
  | CombatAttackPaused;
