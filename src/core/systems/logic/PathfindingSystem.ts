import { Actor, Pathfinder, Position, Tweened } from '@core/components';
import { Action } from '@lib/enums';
import { isSamePoint } from '@utils/geometry';
import { System } from 'tecs';

export class PathfindingSystem extends System {
  public static readonly type = 'pathfinder';

  protected $ = {
    mobs: this.ctx.$.components(Pathfinder, Position).persist(),
    finders: this.ctx.$.components(Pathfinder, Actor, Position)
      .some.components(Tweened)
      .persist()
  };

  public tick(): void {
    const collisions = this.ctx.game.$.map.collisions;
    for (const { $ } of this.$.finders) {
      const { pathfinder } = $;

      if ($.action.data.id === Action.SET_DESTINATION) {
        const { target } = $.action.data;
        if (collisions.isObstacle(target)) {
          $.action.data = { id: Action.NONE };
        } else {
          pathfinder.destination = target;
        }
      }

      if (pathfinder.destination) {
        const isCanceled = ![Action.MOVE, Action.SET_DESTINATION].includes(
          $.action.data.id
        );

        if (isCanceled) {
          console.log('movement canceled');
          pathfinder.destination = null;
          pathfinder.path = [];
          continue;
        }

        if ($.tween?.active) {
          continue;
        }

        // @todo - determine if we're done tweening.
        if (isSamePoint(pathfinder.destination, $.position)) {
          pathfinder.destination = null;
          pathfinder.path = [];
          $.action.data = { id: Action.NONE };
          continue;
        }

        // determine if our destination has changed.
        if (!pathfinder.path.length) {
          pathfinder.path =
            this.ctx.game.$.map.getPath(
              { x: $.position.x, y: $.position.y },
              pathfinder.destination
            ) ?? [];
        }

        if (pathfinder.isActive) {
          const target = pathfinder.path.shift();
          if (target) {
            $.action.data = {
              id: Action.MOVE,
              delta: {
                x: target.x - $.position.x,
                y: target.y - $.position.y
              }
            };
          }
        }
      }
    }
  }
}
