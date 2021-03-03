import { Entity } from 'tecs';

import {
  AreaOfEffect,
  Sprite,
  Position,
  Collision,
  LightSource,
  Renderable,
  Text,
  Item,
  Effects,
  Equippable
} from '../components';

export { Door } from './interactive/Door';
export { Chest } from './interactive/Chest';
export { Player } from './mobs/Player';
export { NPC } from './mobs/NPC';
export { Monster } from './mobs/Monster';

export const Cell = Entity.with(Position, Sprite, Collision, Renderable);
export const Mob = Entity.with(Position, Sprite, Renderable, LightSource);
export const Light = Entity.with(Position, LightSource);

export const Weapon = Entity.with(
  Position,
  Sprite,
  Renderable,
  Text,
  Item,
  Equippable
);

export const Scroll = Entity.with(Position, Sprite, Renderable, Text, Item);

export const Potion = Entity.with(
  Position,
  Sprite,
  Renderable,
  Text,
  Item,
  Effects
);
export const Book = Entity.with(
  Position,
  Sprite,
  Renderable,
  Text,
  Item,
  Effects
);

export const Attack = Entity.with(AreaOfEffect, Equippable, Position);
