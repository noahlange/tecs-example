import { Actor, Pathfinder, Position } from '@core/components';
import { Action } from '@lib/enums';
import { isSamePoint } from '@utils/geometry';
import { System } from 'tecs';

export class Pathfinding extends System {
  public static readonly type = 'pathfinder';

  protected $ = {
    mobs: this.world.query.components(Pathfinder, Position).persist(),
    finders: this.world.query.components(Pathfinder, Actor, Position).persist()
  };

  public tick(): void {
    for (const { $ } of this.$.finders) {
      const { pathfinder } = $;

      if ($.action.data.id === Action.SET_DESTINATION) {
        const { target, isActive, isVisible } = $.action.data;
        pathfinder.destination = target;
        pathfinder.isActive = isActive;
        pathfinder.isVisible = isVisible;
        $.action.data = { id: Action.NONE };
      }

      if (pathfinder.destination) {
        if (isSamePoint(pathfinder.destination, $.position)) {
          pathfinder.destination = null;
          continue;
        }

        // determine if our destination has changed.
        if (
          !pathfinder.path.length &&
          !isSamePoint($.position, pathfinder.destination)
        ) {
          pathfinder.path =
            this.world.game.$.map.getPath(
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
