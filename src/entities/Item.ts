import { Entity } from 'tecs';
import { Position, Sprite, Velocity } from '../components';

import { WIDTH, HEIGHT } from '../utils';

export class Item extends Entity.with(Sprite, Position, Velocity) {
  public init(): void {
    this.$.position.r = Math.random() * 2;
    this.$.position.x = WIDTH / 4 + Math.random() * (WIDTH / 2);
    this.$.position.y = HEIGHT / 4 + Math.random() * (HEIGHT / 2);
    this.$.velocity.dx = 2 * Math.random();
    this.$.velocity.dy = 2 * Math.random();
  }
}
