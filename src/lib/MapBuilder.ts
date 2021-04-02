import type { Rect, Vector2 } from '@types';
import type { Rectangle, Vector2Array } from '@lib';
import { TileType } from '@enums';

import { GameMap } from './GameMap';
import { RNG } from '@utils';

export interface MapBuilderOpts {
  brush?: number;
  width: number;
  height: number;
}

export abstract class MapBuilder {
  protected map: GameMap;
  protected brush: number = 1;
  protected width: number;
  protected height: number;

  public set tiles(tiles: Vector2Array<TileType>) {
    this.map.tiles = tiles;
    this.map.history.push(tiles);
  }

  public get tiles(): Vector2Array<TileType> {
    return this.map.tiles;
  }

  public *entries(): IterableIterator<[Vector2, TileType]> {
    yield* this.map.tiles.entries();
  }

  public get history(): Vector2Array<TileType>[] {
    return this.map.history;
  }

  public get bounds(): Rectangle {
    return this.map.bounds;
  }

  protected getRandomPoint(): Vector2 {
    const b = this.map.bounds;
    return {
      x: RNG.int.between(0, b.width),
      y: RNG.int.between(0, b.height)
    };
  }

  public getSpawn(): Vector2 {
    const { width, height } = this.map.bounds;
    let i = 0;
    let pt: Vector2 | null = null;
    do {
      pt = this.getRandomPoint();
      if (this.map.tiles.is(pt, TileType.FLOOR)) {
        return pt;
      } else {
        pt = null;
      }
      i++;
    } while (pt === null && i < width * height);

    return this.map.bounds.center;
  }

  protected getBrushPoints(point: Vector2): Vector2[] {
    const points = [];
    if (this.brush === 1) {
      return [point];
    } else {
      for (let x = point.x; x < point.x + this.brush; x++) {
        if (x < 0 || x > this.width - 1) {
          continue;
        }
        for (let y = point.y; y < point.y + this.brush; y++) {
          if (y < 0 || y > this.height - 1) {
            continue;
          }
          points.push({ x, y });
        }
      }
    }
    return points;
  }

  protected drawRectangle(rect: Rect, tile: TileType): void {
    for (let y = rect.y1; y <= rect.y2; y++) {
      for (let x = rect.x1; x <= rect.x2; x++) {
        this.map.add({ x, y }, tile);
      }
    }
  }

  public abstract generate(): void;

  public constructor(options: MapBuilderOpts) {
    this.map = new GameMap(options);
    this.brush = options.brush ?? 1;
    this.width = options.width;
    this.height = options.height;
  }
}
