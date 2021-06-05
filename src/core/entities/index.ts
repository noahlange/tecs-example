import { Usable } from '@core/components/Usable';
import { Entity } from 'tecs';

import {
  AreaOfEffect,
  Collision,
  IsEquipment,
  Item,
  LightSource,
  Position,
  Renderable,
  Sprite,
  Text
} from '../components';
import { Chest } from './interactive/Chest';
import { Door } from './interactive/Door';

const Cell = Entity.with(Position, Sprite, Collision, Renderable);
const Light = Entity.with(Position, LightSource);
const Mob = Entity.with(Position, Sprite, Renderable, LightSource);
const Attack = Entity.with(AreaOfEffect, IsEquipment, Position, Usable);

const Equipment = Entity.with(
  Position,
  Sprite,
  Renderable,
  Text,
  Item,
  IsEquipment
);

export { Cell, Mob, Light, Attack, Equipment, Door, Chest };
