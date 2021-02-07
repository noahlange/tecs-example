import type { Entity } from 'tecs';
import { System } from 'tecs';

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
import { ID, UIMode } from '../types';
import { getInteractionPos, getNewDirection, toCoordString } from '../utils';
import { Core, Door, NPC, Chest } from '../entities';

export class Actions extends System {
  public static type = 'actions';

  public collisions: Record<string, boolean> = {};
  public mobs: Record<
    string,
    Entity<{ collision: Collision; position: Position }>
  > = {};

  public tick(): void {
    const game = this.world.query.entities(Core).first();

    // bail if we're not in "interacting with the world" mode
    if (game?.$.game.mode === UIMode.DIALOGUE) {
      return;
    }

    const mobs = this.world.query.all
      .components(Collision, Position, Interactive)
      .some.components(Glyph, Collision, Text, Talk)
      .get();

    for (const c of this.world.query.all
      .components(Action, Position)
      .any.changed.components(Action, Position)) {
      const { $$, $ } = c;

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

      const interactive = adjacent
        .filter(({ $ }) => $.position.x === next.x && $.position.y === next.y)
        .shift();

      switch ($.action.action) {
        case ID.INTERACT: {
          if (
            interactive instanceof Door ||
            interactive instanceof NPC ||
            interactive instanceof Chest
          ) {
            interactive.interact();
          }
          break;
        }
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
    const components = this.world.query.all
      .components(Collision, Position)
      .none.components(Interactive, Action)
      .get();

    this.collisions = components
      .filter(item => !item.$.collision.passable)
      .reduce((a, { $ }) => {
        return { ...a, [toCoordString($.position)]: $.collision.passable };
      }, this.collisions);
  }
}
