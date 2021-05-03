import { Entity } from 'tecs';

import {
  Collision,
  Interactive,
  Position,
  Renderable,
  Sprite
} from '../../components';

export class Chest extends Entity.with(
  Sprite,
  Position,
  Collision,
  Renderable,
  Interactive
) {
  public static data = {
    sprite: { key: 'chests.chest_01' }
  };

  public open = false;
  public interact(): void {
    const { $ } = this;
    this.open = !this.open;
    $.sprite.key = this.open ? 'chests.chest_01_open' : 'chests.chest_01';
  }
}
