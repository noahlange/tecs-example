export enum InputAction {
  CMD_INTERACT = 0,
  CMD_UP = 1,
  CMD_DOWN = 2,
  CMD_LEFT = 3,
  CMD_RIGHT = 4
}

export enum EquipSlot {
  ITEM_NONE = 0,
  WEAPON_MAIN = 1,
  WEAPON_OFF = 2,
  ARMOR_HEAD = 3,
  ARMOR_TORSO = 4,
  ARMOR_LEGS = 5,
  ARMOR_HANDS = 6,
  ARMOR_FEET = 7,
  ITEM_RING = 8,
  ITEM_AMULET = 9
}

export enum DamageType {
  SHARP = 0,
  BLUNT = 1,
  ENERGY = 2,
  ARCANE = 3
}

export enum Direction {
  N = 0,
  NE = 1,
  E = 2,
  SE = 3,
  S = 4,
  SW = 5,
  W = 6,
  NW = 7
}

export enum AOE {
  LINE = 0,
  SEMICIRCLE = 1,
  CIRCLE = 2,
  CONE = 3,
  CROSS = 4
}

export enum GameState {
  PAUSED = 0,
  RUNNING = 1
}

export enum Faction {
  PLAYER = 0,
  MONSTER = 1
}

export enum AIType {
  PASSIVE = 0,
  AGGRESSIVE = 1,
  FRENZIED = 2
}

export enum AIState {
  IDLE = 0,
  ACTIVE = 1
}

export enum EffectType {
  NONE = 0,
  HP_ADD = 1,
  HP_MAX = 2
}

export enum ItemType {
  CONSUMABLE = 1,
  WEAPON = 2,
  MAGIC = 3,
  ARMOR = 4,
  MISC = 5
}

export enum Tag {
  HAS_INVENTORY = 'has_inventory',
  IN_INVENTORY = 'in_inventory',
  TO_DESTROY = 'to_destroy',
  IS_HIDDEN = 'is_hidden',
  IS_CONSUMABLE = 'is_consumable',
  IS_EQUIPPABLE = 'is_equippable'
}
