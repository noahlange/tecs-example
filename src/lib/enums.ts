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

export enum Projection {
  ORTHOGRAPHIC = 0,
  ISOMETRIC = 1
}

export enum InputAction {
  CMD_INTERACT = 0,
  CMD_UP = 1,
  CMD_DOWN = 2,
  CMD_LEFT = 3,
  CMD_RIGHT = 4
}

// 00: no collision
// 10: obstruction only
// 01: obstacle only
// 11: obstacle + obstruction

export enum Collision {
  NONE = 0b00,
  OBSTRUCTION = 0b10,
  OBSTACLE = 0b01,
  COMPLETE = 0b11
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

export enum TileType {
  WALL = 'walls.wall_01_ew',
  FLOOR = 'floors.floor_02_06'
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
  IS_CAMERA = 'is_camera',
  HAS_INVENTORY = 'has_inventory',
  IN_INVENTORY = 'in_inventory',
  TO_DESTROY = 'to_destroy',
  IS_HIDDEN = 'is_hidden',
  IS_INACTIVE = 'is_inactive',
  IS_IMPERMANENT = 'is_impermanent',
  IS_CONSUMABLE = 'is_consumable',
  IS_EQUIPPABLE = 'is_equippable'
}

export enum Attribute {
  DEX = 'DEX',
  AGI = 'AGI',
  CON = 'CON',
  INT = 'INT',
  PER = 'PER',
  CHA = 'CHA',
  MAG = 'MAG'
}

export enum Skill {}
export enum Focus {}
