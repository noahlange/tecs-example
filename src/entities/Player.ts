import { Entity } from 'tecs';

import {
  Action,
  Glyph,
  Position,
  Playable,
  LightSource,
  Renderable
} from '../components';

export class Player extends Entity.with(
  Glyph,
  Position,
  Action,
  Renderable,
  Playable,
  LightSource
) {}
