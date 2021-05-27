import type { GameTileData, Vector2Array } from '@lib';

import { Position } from '@core/components';
import { Cell } from '@core/entities';
import { Canyon as Builder } from '@core/maps';
import { Scene } from '@lib';
import { Collision, Projection, Tag, TileType } from '@lib/enums';
import { isEmpty } from '@utils';
import { Entity } from 'tecs';

const getKeyFromTile = (data: GameTileData): string => {
  return data.spriteKey ?? isEmpty(data.collision)
    ? TileType.FLOOR
    : TileType.WALL;
};

const Camera = Entity.with(Position);

export class MapTest extends Scene {
  protected builder: Builder = new Builder({ width: 64, height: 64 });
  protected entities: InstanceType<typeof Cell>[] = [];
  protected current: Vector2Array<GameTileData> | null = null;

  public getNextSnapshot(): void {
    for (const entity of this.entities) {
      entity.tags.add(Tag.TO_DESTROY);
    }
    const snapshot = this.builder.history.shift();
    if (snapshot) {
      if (this.current) {
        for (const { $ } of this.entities) {
          const tile = this.current.get($.position, {});
          const key = getKeyFromTile(tile);
          if (key !== $.sprite.key) {
            $.sprite.key = key;
            $.render.dirty = true;
            $.render.fg = { r: 255, g: 255, b: 255, a: 1 };
          }
        }
      } else {
        this.entities = Array.from(snapshot.entries()).map(([pos, data]) => {
          return this.game.ecs.create(Cell, {
            position: pos,
            collision: { value: Collision.NONE },
            sprite: { key: getKeyFromTile(data) },
            render: { dirty: true, fg: { r: 255, g: 255, b: 255, a: 1 } }
          });
        });
      }
      this.current = snapshot;
    }
  }

  public tick(): void {
    const next = this.game.$.input.getNextEvent();
    if (next?.isKeyboard) {
      switch (next.key) {
        case ' ':
          this.getNextSnapshot();
          break;
      }
    }
  }

  public init(): void {
    const world = this.game.$.map.world;
    world.generate();

    this.game.ecs.create(
      Camera,
      { position: { x: world.width / 3, y: world.height / 3 } },
      [Tag.IS_CAMERA]
    );
  }
}
