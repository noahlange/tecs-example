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
  COMBAT_ATTACK_PAUSED = 'combat_attack_paused',
  TOGGLE_PAUSE = 'pause'
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

export enum TileType {
  WALL = 'walls.wall_01_ew',
  FLOOR = 'floors.floor_02_06'
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
  NONE = 0,
  FRIENDLY = 1,
  PASSIVE = 2,
  HOSTILE = 3,
  FRENZIED = 4
}

export enum AIState {
  IDLE = 0,
  ACTIVE = 1
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
  IS_EQUIPPABLE = 'is_equippable',
  IS_ANIMATING = 'is_animating'
}
