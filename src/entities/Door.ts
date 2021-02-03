import { Entity } from 'tecs';
import {
  Collision,
  Glyph,
  Interactive,
  Position,
  Renderable
} from '../components';

export class Door extends Entity.with(
  Glyph,
  Position,
  Interactive,
  Collision,
  Renderable
) {
  public get isOpen(): boolean {
    return this.$.collision.passable;
  }

  public toggle(): void {
    const { $$ } = this;
    const next = !this.isOpen;
    $$.collision.passable = next;
    $$.collision.allowLOS = next;
    $$.glyph.text = next ? '/' : '-';
  }
}
