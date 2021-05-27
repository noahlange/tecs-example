import { Actor, Position, Sprite } from '@core/components';
import { Animated } from '@core/components/Animated';
import { Action, Tag } from '@lib/enums';
import { System } from 'tecs';

export class Animation extends System {
  public static readonly type = 'animation';

  public $ = {
    animating: this.world.query.all
      .components(Animated, Sprite, Position)
      .some.components(Actor)
      .all.tags(Tag.IS_ANIMATING)
      .persist()
  };

  public updateActionAnimation(): void {
    for (const entity of this.$.animating) {
      const { animation: a } = entity.$;
      const curr = a.animation;
      if (entity.has(Actor)) {
        switch (entity.$.action.data.id) {
          case Action.MOVE: {
            a.animation = 'run';
            break;
          }
          case Action.NONE: {
            a.animation = 'idle';
            break;
          }
        }
        if (a.animation !== curr) {
          a.index = 0;
          a.reset = curr;
        }
      }
    }
  }

  public updateAnimationFrame(dt: number): void {
    for (const entity of this.$.animating) {
      const [$, a] = [entity.$, entity.$.animation];
      const ms = 1000 / a.fps;

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
  }

  public tick(dt: number): void {
    this.updateActionAnimation();
    this.updateAnimationFrame(dt);
  }
}
