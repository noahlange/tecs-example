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
import { Core, Door } from '../entities';
import { NPC } from '../entities/NPC';

export class Actions extends System {
  public static type = 'actions';

  public collisions: Record<string, boolean> = {};
  public mobs: Record<
    string,
    Entity<{ collision: Collision; position: Position }>
  > = {};

  public tick(): void {
    const game = this.world.query.ofType(Core).first();

    // bail if we're not in "interacting with the world" mode
    if (game?.$.game.mode === UIMode.DIALOGUE) {
      return;
    }

    const mobs = this.world.query
      .with(Collision, Position, Interactive)
      .some(Glyph, Text, Talk)
      .get();

    for (const c of this.world.query.changed(Action, Position)) {
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
          if (interactive instanceof Door || interactive instanceof NPC) {
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
    this.collisions = this.world.query
      .with(Collision, Position)
      .without(Interactive, Action)
      .get()
      .filter(item => !item.$.collision.passable)
      .reduce((a, { $ }) => {
        return { ...a, [toCoordString($.position)]: $.collision.passable };
      }, this.collisions);
  }
}
