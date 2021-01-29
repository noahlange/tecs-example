import { System } from 'tecs';

import type { Point } from '../types';

import { Collision, Glyph, Position, Interactive, Action } from '../components';
import { Direction, ID } from '../types';
import { getInteractionPos, toCoordString } from '../utils';

export class Actions extends System {
  public static type = 'actions';

  public cells: Record<string, boolean> = {};

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
          this.cells[key] !== false &&
          !adjacent
            .filter(mob => !mob.$.collision.passable)
            .find(a => a.$.position.x === x && a.$.position.y === y)
        );
      };

      // even if we can't move, we'd still like to change direction.
      switch ($.action.action) {
        case ID.MOVE_UP:
          $$.position.d = Direction.N;
          break;
        case ID.MOVE_DOWN:
          $$.position.d = Direction.S;
          break;
        case ID.MOVE_LEFT:
          $$.position.d = Direction.W;
          break;
        case ID.MOVE_RIGHT:
          $$.position.d = Direction.E;
          break;
      }

      const next = getInteractionPos($.position, $.position.d);

      switch ($.action.action) {
        case ID.INTERACT:
          {
            const doors = adjacent.filter(({ $ }) => {
              return $.position.x === next.x && $.position.y === next.y;
            });
            for (const { $$ } of doors) {
              if ($$.glyph) {
                const passable = !$$.collision.passable;
                $$.collision.passable = passable;
                $$.collision.allowLOS = passable;
                $$.glyph.text = passable ? '/' : '-';
              }
            }
          }
          break;
        case ID.MOVE_UP:
        case ID.MOVE_DOWN:
        case ID.MOVE_LEFT:
        case ID.MOVE_RIGHT:
          if (noCollision(next)) {
            $$.position.y = next.y;
            $$.position.x = next.x;
          }
          break;
      }

      // unset action
      $$.action.action = ID.NONE;
    }
  }

  public init(): void {
    this.cells = this.world.query
      .with(Collision, Position)
      .without(Interactive, Action)
      .all()
      .filter(item => !item.$.collision.passable)
      .reduce((a, { $ }) => {
        return { ...a, [toCoordString($.position)]: $.collision.passable };
      }, this.cells);
  }
}
