import { Entity } from 'tecs';

import {
  Glyph,
  Position,
  Collision,
  LightSource,
  Renderable,
  Description,
  Interactive,
  GameMap as Game
} from '../components';

export { Door } from './Door';
export { Player } from './Player';

export const Cell = Entity.with(Glyph, Position, Collision, Renderable);
export const Mob = Entity.with(Glyph, Position, Renderable, LightSource);
export const Light = Entity.with(Position, LightSource);

export const Item = Entity.with(
  Position,
  Glyph,
  Renderable,
  Interactive,
  Description,
  Collision
);

export const GameMap = Entity.with(Game);
