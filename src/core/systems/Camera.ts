import type { Context, EntityType } from 'tecs';

import { Position } from '@core/components';
import { Player } from '@core/entities';
import { Tag } from '@lib/enums';

import { Gameplay } from '../scenes/Gameplay';

let following: EntityType<[typeof Position]> | null = null;

export function Camera(ctx: Context): void {
  switch (true) {
    case ctx.game.scene instanceof Gameplay: {
      const camera = ctx.$.tags(Tag.IS_CAMERA).components(Position).first();
      if (camera) {
        const screen = ctx.game.$.renderer.getScreenPoint(camera.$.position);
        ctx.game.$.renderer.viewport.moveCenter(screen.x, screen.y);
        following = camera;
      } else {
        const player = ctx.$.entities(Player).first();
        if (player) {
          const pixi = player.$.sprite.pixi;
          if (pixi && player !== following) {
            ctx.game.$.renderer.viewport.follow(pixi);
            following = player;
          }
        }
      }
    }
  }
}
