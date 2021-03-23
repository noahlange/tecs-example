import { Rectangle, Vector2Array } from '@lib';
import type { Vector2 } from '@types';
import { TileType } from '@enums';

interface GameMapOptions {
  width: number;
  height: number;
}

export class GameMap {
  public tiles!: Vector2Array<TileType>;
  public history: Vector2Array<TileType>[] = [];

  public get bounds(): Rectangle {
    return new Rectangle({
      x1: 0,
      x2: this.tiles.width,
      y1: 0,
      y2: this.tiles.height
    });
  }

  public add(point: Vector2, tile: TileType = TileType.WALL): void {
    this.tiles.set(point, tile);
  }

  public snapshot(): void {
    this.history.push(this.tiles.clone());
  }

  public *entries(): IterableIterator<[Vector2, TileType]> {
    yield* this.tiles.entries();
  }

  public constructor(options: GameMapOptions) {
    this.tiles = new Vector2Array<TileType>(
      {
        w: options.width,
        h: options.height
      },
      TileType.WALL
    );
  }
}
