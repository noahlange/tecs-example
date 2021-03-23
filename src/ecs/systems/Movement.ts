import type { EntityType } from 'tecs';
import { System } from 'tecs';

import { Position, Actor, Pathfinder, Playable } from '../components';
import { Action } from '@utils';
import { Player } from '@ecs/entities';

export class Movement extends System {
  public static type = 'movement';

  protected $ = {
    player: this.world.query.entities(Player),
    movers: this.world.query
      .components(Actor, Position)
      .some.components(Pathfinder, Playable)
      .persist()
  };

  protected updateChunk(
    entity: EntityType<
      [typeof Actor, typeof Position],
      [typeof Pathfinder, typeof Playable]
    >
  ): void {
    const { x, y, chunkX, chunkY } = entity.$.position;
    const { x1, x2, y1, y2 } = this.world.game.$.map.bounds;
    let [nextX, nextY] = [chunkX, chunkY];

    if (x < x1 || x >= x2) {
      entity.$.position.x = x < x1 ? x2 - 1 : 0;
      nextX += x < x1 ? -1 : 1;
      entity.$.position.chunkX = nextX;
    }

    if (y < y1 || y >= y2) {
      entity.$.position.y = y < y1 ? y2 - 1 : 0;
      nextY += y < y1 ? -1 : 1;
      entity.$.position.chunkY = nextY;
    }

    if (entity.$.player && (nextX !== chunkX || nextY !== chunkY)) {
      this.world.game.$.map.update({ x: nextX, y: nextY });
    }
  }

  public tick(): void {
    if (this.world.game.paused) {
      return;
    }

    const movers = Array.from(this.$.movers).filter(
      ({ $ }) => $.action.data.id === Action.MOVE
    );

    for (const entity of movers) {
      const { $ } = entity;
      switch ($.action.data.id) {
        case Action.MOVE: {
          const { delta } = $.action.data;
          $.position.x += delta.x;
          $.position.y += delta.y;
          $.action.data = { id: Action.NONE };
          if ($.pathfinder) {
            $.pathfinder.destination = null;
            $.pathfinder.path = [];
          }
          this.updateChunk(entity);
          break;
        }
      }
    }
  }
}
