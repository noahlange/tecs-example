import { Entity } from 'tecs';

import {
  AreaOfEffect,
  Collision,
  Effects,
  Equippable,
  Item,
  LightSource,
  Position,
  Renderable,
  Sprite,
  Text
} from '../components';

export const Cell = Entity.with(Position, Sprite, Collision, Renderable);
export const Mob = Entity.with(Position, Sprite, Renderable, LightSource);
export const Light = Entity.with(Position, LightSource);
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

export const Equipment = Entity.with(
  Position,
  Sprite,
  Renderable,
  Text,
  Item,
  Equippable
);

export { Door } from './interactive/Door';
export { Chest } from './interactive/Chest';
export { Player } from './mobs/Player';
export { Monster } from './mobs/Monster';
