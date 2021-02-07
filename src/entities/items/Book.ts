import { Entity } from 'tecs';
import {
  Collision,
  Glyph,
  Interactive,
  Position,
  Renderable,
  Text
} from '../../components';
import type { RGBColor } from '../../types';

export class Book extends Entity.with(
  Position,
  Glyph,
  Renderable,
  Interactive,
  Text,
  Collision
) {
  public static data = {
    glyph: { text: 'B', fg: [255, 255, 255] as RGBColor },
    text: { title: 'Book', value: 'This is a book.' },
    collision: { passable: true, allowLOS: true }
  };
}
