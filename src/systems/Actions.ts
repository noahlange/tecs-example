import type { Entity } from 'tecs';
import { System } from 'tecs';

import type { Point } from '../types';

import { Collision, Glyph, Position, Interactive, Action } from '../components';
import { ID } from '../types';
import { getInteractionPos, getNewDirection, toCoordString } from '../utils';
import { Door } from '../entities';

export class Actions extends System {
  public static type = 'actions';

  public collisions: Record<string, boolean> = {};
  public mobs: Record<
    string,
    Entity<{ collision: Collision; position: Position }>
  > = {};

  public tick(): void {
    const mobs = this.world.query
      .with(Collision, Position, Interactive)
      .some(Glyph)
      .all();

    for (const { $, $$ } of this.world.query.changed(Action, Position)) {
      const adjacent = mobs.filter(
        mob =>
          Math.abs(mob.$.position.x - $.position.x) <= 1 &&
          Math.abs(mob.$.position.y - $.position.y) <= 1
      );

      const noCollision = ({ x, y }: Point): boolean => {
        const key = toCoordString({ x, y });
        return (
          this.collisions[key] !== false &&
          !adjacent
            .filter(mob => !mob.$.collision.passable)
            .find(mob => mob.$.position.x === x && mob.$.position.y === y)
        );
      };

      const direction = getNewDirection($.action.action) ?? $.position.d;
      $$.position.d = direction;

      const next = getInteractionPos($.position, direction);

      const interacting = adjacent.filter(
        ({ $ }) => $.position.x === next.x && $.position.y === next.y
      );

      switch ($.action.action) {
        case ID.INTERACT:
          {
            for (const interactive of interacting) {
              if (interactive instanceof Door) {
                interactive.toggle();
              }
            }
          }
          break;
        case ID.MOVE_UP:
        case ID.MOVE_DOWN:
        case ID.MOVE_LEFT:
        case ID.MOVE_RIGHT: {
          if (direction) {
            $$.position.d = direction;
          }
          if (noCollision(next)) {
            $$.position.x = next.x;
            $$.position.y = next.y;
          }
          break;
        }
      }

      // unset action
      $$.action.action = ID.NONE;
    }
  }

  public init(): void {
    this.collisions = this.world.query
      .with(Collision, Position)
      .without(Interactive, Action)
      .all()
      .filter(item => !item.$.collision.passable)
      .reduce((a, { $ }) => {
        return { ...a, [toCoordString($.position)]: $.collision.passable };
      }, this.collisions);
  }
}
