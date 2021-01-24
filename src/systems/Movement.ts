import { System } from 'tecs';
import { Position, Velocity } from '../components';
import { WIDTH, HEIGHT, SPRITE } from '../utils';

const limits = {
  x: [SPRITE, WIDTH - SPRITE],
  y: [SPRITE, HEIGHT + SPRITE]
};

export class Movement extends System {
  public static readonly type = 'movement';

  public tick(): void {
    for (const { $ } of this.world.query.with(Position, Velocity)) {
      $.position.x += $.velocity.dx;
      $.position.y += $.velocity.dy;
      $.position.r = ($.position.r + 0.01) % 360;

      const [minX, maxX] = limits.x;
      if ($.position.x >= maxX || $.position.x <= minX) {
        $.velocity.dx *= -1;
      }

      const [minY, maxY] = limits.y;
      if ($.position.y >= maxY || $.position.y <= minY) {
        $.velocity.dy *= -1;
      }
    }
  }
}
