import type { Context, EntityType } from 'tecs';

import { Actor, Animated, Position, Sprite, Tweened } from '@core/components';
import { Action, Tag } from '@lib/enums';

type AnimatedEntity = EntityType<
  [typeof Animated, typeof Sprite, typeof Position],
  [typeof Actor, typeof Tweened]
>;

/**
 * Determine an actor's current animation based on their action id.
 * @param entity
 */
function updateAnimationAction(entity: AnimatedEntity): void {
  const { animation, action, tween } = entity.$;
  const current = animation.name;

  if (entity.has(Actor)) {
    // todo: find a more scaleable way of handling this
    switch (action?.data.id) {
      case Action.COMBAT_ATTACK: {
        animation.name = 'attack';
        break;
      }
      case Action.MOVE: {
        animation.name = 'walk';
        break;
      }
      default: {
        animation.name = 'idle';
        break;
      }
    }

    if (entity.$.animation.name !== current) {
      animation.index = 0;
      animation.reset = current;
      if (tween?.tween) {
        tween.tween.stop();
        tween.active = false;
      }
    }
  }
}

function updateAnimationFrame(entity: AnimatedEntity, dt: number): void {
  const [$, a] = [entity.$, entity.$.animation];
  const ms = 1000 / (a.fps ?? 24);

  if (a.index === null) {
    // no animation is running, for whatever reason
    if (a.reset === null) {
      // animation hasn't started
      a.reset = $.sprite.key;
      a.index = 0;
    } else {
      // animation has stopped
      entity.tags.delete(Tag.IS_ANIMATING);
      // reset to last frame before animation started
      $.sprite.key = a.reset;
      a.reset = null;
    }
  } else {
    a.dt += dt;
    // see if we need to change frames
    if (a.dt >= ms) {
      // @todo handle directions
      const frames = a.getFrames($.position.d);
      // increment, looping around if we've gotten to the end...
      a.index = (a.index + 1) % frames.length;
      // update using the direction
      $.sprite.key = a.getFrameKey($.position.d);
      a.dt = 0;
    }
  }
}

export function AnimationSystem(ctx: Context, dt: number): void {
  const $ = {
    animating: ctx.$.all
      .components(Animated, Sprite, Position)
      .some.components(Actor, Tweened)
      .all.tags(Tag.IS_ANIMATING)
  };
  for (const entity of $.animating) {
    updateAnimationAction(entity);
    updateAnimationFrame(entity, dt);
  }
}
