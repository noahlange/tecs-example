import type { Context, EntityType } from 'tecs';

import { Position, Sprite } from '@core/components';
import { Tag } from '@lib/enums';

let following: EntityType<[typeof Position]> | null = null;

export function CameraSystem(ctx: Context): void {
  if (!ctx.game.paused) {
    const camera = ctx.$.tags(Tag.IS_CAMERA)
      .components(Position, Sprite)
      .first();
    if (camera) {
      const pixi = camera.$.sprite.pixi;
      if (pixi && camera !== following) {
        ctx.game.$.renderer.viewport.follow(pixi);
        following = camera;
      }
    }
  }
}
