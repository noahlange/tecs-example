import { Entity } from 'tecs';
import {
  Collision,
  Container,
  Glyph,
  Interactive,
  Position,
  Renderable
} from '../../components';

import { T } from '../../types';

export class Chest extends Entity.with(
  Glyph,
  Position,
  Collision,
  Renderable,
  Interactive,
  Container
) {
  public static data = {
    glyph: { text: T.CHEST }
  };

  public interact(): void {
    const { $$ } = this;
    const next = !$$.container.open;
    $$.container.open = next;
    $$.glyph.text = next ? T.CHEST_OPEN : T.CHEST;
  }
}
