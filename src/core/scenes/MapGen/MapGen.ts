import type { Vector2Array } from '@lib';
import { Builder } from '../../../maps/generators/Canyon';
import { Cell as CellEntity } from '@ecs/entities';
import { Scene } from '@lib';

import { TileType } from '@enums';

const getKeyFromTile = (type: TileType): string => {
  const isWall = type === TileType.WALL;
  return isWall ? 'wall_01_ew' : 'floor_02_06';
};

export class MapGen extends Scene {
  protected builder: Builder = new Builder({ width: 64, height: 64 });
  protected entities: InstanceType<typeof CellEntity>[] = [];
  protected current: Vector2Array<TileType> | null = null;

  public getNextSnapshot(): void {
    const snapshot = this.builder.history.shift();
    if (snapshot) {
      if (this.current) {
        for (const { $ } of this.entities) {
          const key = getKeyFromTile(this.current.get($.position));
          if (key !== $.sprite.key) {
            $.sprite.key = key;
            $.render.dirty = true;
            $.render.fg = { r: 255, g: 255, b: 255, a: 1 };
          }
        }
      } else {
        this.entities = Array.from(snapshot.entries()).map(([pos, sprite]) => {
          const isWall = sprite === TileType.WALL;
          return this.game.ecs.create(CellEntity, {
            position: pos,
            collision: { passable: !isWall, allowLOS: !isWall },
            sprite: {
              key: getKeyFromTile(sprite)
            },
            render: { dirty: true, fg: { r: 255, g: 255, b: 255, a: 1 } }
          });
        });
      }
      this.current = snapshot;
    }
  }

  public tick(): void {
    const next = this.game.$.commands.getNextEvent();
    if (next?.isKeyboard) {
      switch (next.key) {
        case ' ':
          this.getNextSnapshot();
          break;
      }
    }
  }

  public init(): void {
    // @todo: reimplement
  }
}
