import { Entity } from 'tecs';
import {
  Collision,
  Glyph,
  Position,
  Renderable,
  Text,
  Talk,
  Interactive
} from '../components';

export class NPC extends Entity.with(
  Glyph,
  Position,
  Renderable,
  Text,
  Talk,
  Collision,
  Interactive
) {
  public interact(): void {
    this.$$.talk.active = true;
  }
}
