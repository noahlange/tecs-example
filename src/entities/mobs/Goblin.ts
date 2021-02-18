import { Entity } from 'tecs';
import {
  Collision,
  Glyph,
  Interactive,
  Position,
  Renderable,
  Stats,
  Text
} from '../../components';
import type { RGBColor } from '../../types';

export class Goblin extends Entity.with(
  Glyph,
  Position,
  Renderable,
  Text,
  Collision,
  Stats,
  Interactive
) {
  public static readonly data = {
    text: { title: 'Goblin' },
    glyph: { text: 'g', fg: [0, 255, 0] as RGBColor },
    stats: { hp: 25, hpMax: 25 },
    collision: { allowLOS: true, passable: false }
  };
}
