import { Entity } from 'tecs';
import {
  Action,
  Glyph,
  Position,
  Collision,
  Playable,
  LightSource,
  Renderable
} from '../components';
import { Interactive } from '../components/Interactive';

export const Cell = Entity.with(Glyph, Position, Collision, Renderable);
export const Door = Entity.with(
  Glyph,
  Position,
  Interactive,
  Collision,
  Renderable
);
export const Light = Entity.with(Position, LightSource);
export const Mob = Entity.with(Glyph, Position, Renderable, LightSource);
export const Player = Entity.with(
  Glyph,
  Position,
  Action,
  Renderable,
  Playable,
  LightSource
);
