import { Entity } from 'tecs';

import {
  Glyph,
  Position,
  Collision,
  LightSource,
  Renderable,
  Text,
  Interactive,
  UI
} from '../components';

export { Door } from './interactive/Door';
export { Chest } from './interactive/Chest';
export { Player } from './mobs/Player';
export { NPC } from './mobs/NPC';
export { Core } from './Core';

export const Cell = Entity.with(Glyph, Position, Collision, Renderable);
export const Mob = Entity.with(Glyph, Position, Renderable, LightSource);
export const Light = Entity.with(Position, LightSource);

export const Item = Entity.with(
  Position,
  Glyph,
  Renderable,
  Interactive,
  Text,
  Collision
);

export const UIMessage = Entity.with(UI, Text);
export const UIOption = Entity.with(UI, Text);
