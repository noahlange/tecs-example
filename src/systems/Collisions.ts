import { System } from 'tecs';
import type { EntityType } from 'tecs';

import type { Point } from '../types';
import {
  Collision,
  Glyph,
  Position,
  Interactive,
  Action,
  Text,
  Talk
} from '../components';
import { ID } from '../types';
import { getInteractionPos, getNewDirection, toCoordString } from '../utils';

export class Collisions extends System {
  public static type = 'collisions';

  public collisions: Record<string, boolean> = {};

  protected noCollision(
    { x, y }: Point,
    adjacent: EntityType<[typeof Position, typeof Collision]>[]
  ): boolean {
    return (
      this.collisions[toCoordString({ x, y })] !== false &&
      !adjacent
        .filter(mob => !mob.$.collision.passable)
        .find(mob => mob.$.position.x === x && mob.$.position.y === y)
    );
  }

  protected queries = {
    movers: this.world.query.components(Action, Position),
    collisions: this.world.query
      .components(Collision, Position)
      .none.components(Interactive, Action),
    interactives: this.world.query
      .components(Collision, Position, Interactive)
      .some.components(Glyph, Collision, Text, Talk)
  };

  public tick(): void {
    const actions = [ID.MOVE_UP, ID.MOVE_DOWN, ID.MOVE_LEFT, ID.MOVE_RIGHT];

    const movers = this.queries.movers
      .get()
      .filter(({ $ }) => actions.includes($.action.action));

    if (movers.length) {
      const mobs = this.queries.interactives.get();

      for (const { $ } of this.queries.movers) {
        if (!actions.includes($.action.action)) {
          continue;
        }

        const adjacent = mobs.filter(
          mob =>
            Math.abs(mob.$.position.x - $.position.x) <= 2 &&
            Math.abs(mob.$.position.y - $.position.y) <= 2
        );

        $.position.d = getNewDirection($.action.action) ?? $.position.d;
        const next = getInteractionPos($.position);

        switch ($.action.action) {
          case ID.MOVE_UP:
          case ID.MOVE_DOWN:
          case ID.MOVE_LEFT:
          case ID.MOVE_RIGHT: {
            if (this.noCollision(next, adjacent)) {
              $.position.x = next.x;
              $.position.y = next.y;
            }
            // unset action
            $.action.action = ID.NONE;
            break;
          }
        }
      }
    }
  }

  public init(): void {
    for (const { $ } of this.queries.collisions) {
      if (!$.collision.passable) {
        this.collisions[toCoordString($.position)] = false;
      }
    }
  }
}
