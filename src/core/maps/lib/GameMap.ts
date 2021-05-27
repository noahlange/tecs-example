import type { Color, Vector2 } from '@lib/types';

import { Rectangle, Vector2Array } from '@lib';
import { Collision } from '@lib/enums';
import { bit } from '@utils';

interface GameMapOptions {
  width: number;
  height: number;
}

export interface GameTileData {
  spriteKey?: string;
  tint?: Color;
  collision?: Collision | number;
}

export class GameMap {
  public tiles!: Vector2Array<GameTileData>;
  public history: Vector2Array<GameTileData>[] = [];

  public get bounds(): Rectangle {
    return new Rectangle({
      x1: 0,
      x2: this.tiles.width,
      y1: 0,
      y2: this.tiles.height
    });
  }

  public add(point: Vector2, tile: GameTileData): void {
    this.tiles.set(point, tile);
  }

  public collisions = {
    isObstacle: (point: Vector2) =>
      bit.any(Collision.OBSTACLE, this.tiles.get(point)?.collision),
    isObstruction: (point: Vector2) =>
      bit.any(Collision.OBSTRUCTION, this.tiles.get(point)?.collision)
  };

  public snapshot(): void {
    this.history.push(this.tiles.clone());
  }

  public *entries(): IterableIterator<[Vector2, GameTileData]> {
    yield* this.tiles.entries();
  }

  public constructor(options: GameMapOptions) {
    this.tiles = new Vector2Array<GameTileData>(
      { width: options.width, height: options.height },
      null
    );
  }
}
