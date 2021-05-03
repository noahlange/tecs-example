import type { Rect, Vector2 } from '../../../lib/types';
import type { GameTileData } from './GameMap';
import type { Rectangle, Vector2Array } from '@lib';

import { RNG } from '@utils';
import { iterateGrid } from '@utils/geometry';

import { GameMap } from './GameMap';

export interface MapBuilderOpts {
  brush?: number;
  width: number;
  height: number;
}

export abstract class MapBuilder {
  protected map: GameMap;
  protected brush: number = 1;
  public width: number;
  public height: number;

  public set tiles(tiles: Vector2Array<GameTileData>) {
    this.map.tiles = tiles;
    this.map.history.push(tiles);
  }

  public get tiles(): Vector2Array<GameTileData> {
    return this.map.tiles;
  }

  public *entries(): IterableIterator<[Vector2, GameTileData]> {
    yield* this.map.tiles.entries();
  }

  public get history(): Vector2Array<GameTileData>[] {
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
      if (!this.map.collisions.isObstacle(pt)) {
        return pt;
      } else {
        pt = null;
      }
      i++;
    } while (pt === null && i < width * height);

    return this.map.bounds.center;
  }

  protected getBrushPoints(point: Vector2): Vector2[] {
    if (this.brush === 1) {
      return [point];
    } else {
      const bounds = { x: point.x + this.brush, y: point.y + this.brush };
      return Array.from(iterateGrid(point, bounds))
        .filter(({ x, y }) => x > 0 && y > 0)
        .filter(({ x, y }) => x < this.width - 1 && y < this.height - 1);
    }
  }

  protected drawRectangle(rect: Rect, tile: GameTileData): void {
    for (const point of iterateGrid(rect)) {
      this.map.add(point, tile);
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
