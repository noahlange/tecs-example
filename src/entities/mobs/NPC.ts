import { Entity } from 'tecs';
import {
  Collision,
  Glyph,
  Position,
  Renderable,
  Text,
  Talk,
  Interactive
} from '../../components';
import type { RGBColor } from '../../types';
import { T } from '../../utils/tiles';

export class NPC extends Entity.with(
  Glyph,
  Position,
  Renderable,
  Text,
  Talk,
  Collision,
  Interactive
) {
  public static readonly data = {
    text: { title: 'NPC' },
    glyph: { text: T.AT, fg: [255, 0, 0] as RGBColor },
    collision: { allowLOS: true }
  };

  public interact(): void {
    this.$$.talk.active = true;
  }
}
