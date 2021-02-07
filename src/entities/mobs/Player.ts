import { Entity } from 'tecs';

import {
  Action,
  Glyph,
  Position,
  Playable,
  LightSource,
  Renderable
} from '../../components';
import type { RGBColor } from '../../types';
import { T } from '../../utils/tiles';

export class Player extends Entity.with(
  Glyph,
  Position,
  Action,
  Renderable,
  Playable,
  LightSource
) {
  public static readonly data = {
    text: { title: 'Player' },
    light: { color: [150, 150, 0] as RGBColor },
    glyph: { text: T.AT, fg: [255, 255, 255] as RGBColor }
  };
}
