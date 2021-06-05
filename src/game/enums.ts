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

export enum ItemType {
  CONSUMABLE = 1,
  WEAPON = 2,
  MAGIC = 3,
  ARMOR = 4,
  MISC = 5
}

export enum EffectType {
  NONE = 0,
  HP_ADD = 1,
  HP_MAX = 2
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
