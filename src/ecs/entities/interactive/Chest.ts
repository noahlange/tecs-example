import { Entity } from 'tecs';
import {
  Collision,
  Sprite,
  Interactive,
  Position,
  Renderable
} from '../../components';

export class Chest extends Entity.with(
  Sprite,
  Position,
  Collision,
  Renderable,
  Interactive
) {
  public static data = {
    sprite: { key: 'chest_01' }
  };

  public open = false;
  public interact(): void {
    const { $ } = this;
    this.open = !this.open;
    $.sprite.key = this.open ? 'chest_01_open' : 'chest_01';
  }
}
