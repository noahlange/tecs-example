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
import { Chest } from './interactive/Chest';
import { Door } from './interactive/Door';
import { Monster } from './mobs/Monster';
import { Player } from './mobs/Player';

const Cell = Entity.with(Position, Sprite, Collision, Renderable);
const Mob = Entity.with(Position, Sprite, Renderable, LightSource);
const Light = Entity.with(Position, LightSource);
const Scroll = Entity.with(Position, Sprite, Renderable, Text, Item);
const Potion = Entity.with(Position, Sprite, Renderable, Text, Item, Effects);
const Book = Entity.with(Position, Sprite, Renderable, Text, Item, Effects);
const Attack = Entity.with(AreaOfEffect, Equippable, Position);

const Equipment = Entity.with(
  Position,
  Sprite,
  Renderable,
  Text,
  Item,
  Equippable
);

export {
  Cell,
  Mob,
  Light,
  Scroll,
  Potion,
  Book,
  Attack,
  Equipment,
  Door,
  Chest,
  Player,
  Monster
};
