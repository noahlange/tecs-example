import type { Vector2Array } from '@lib';
import type { Vector2 } from '@types';

import { TileType } from '@enums';
import { RNG } from '@utils';
import { MapBuilder } from '@lib';

const deltas: Vector2[] = [
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 }
];

export class Builder extends MapBuilder {
  protected getWalls(map: Vector2Array<TileType>, point: Vector2): Vector2[] {
    return deltas
      .map(d => ({ x: point.x + d.x, y: point.y + d.y }))
      .filter(tile => map.is(tile, TileType.WALL));
  }

  protected gen: number = 0;
  protected gens: number = 7;

  protected get wallPercentage(): number {
    switch (true) {
      case this.gen === 0:
        return 40 / 100;
      case this.gen < 4:
        return 5 / 9;
      default:
        return 4 / 9;
    }
  }

  public generate(): void {
    this.gen = 0;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const roll = RNG.float();
        this.map.add(
          { x, y },
          roll < this.wallPercentage ? TileType.WALL : TileType.FLOOR
        );
      }
    }

    while (this.gen < this.gens) {
      const clone = this.map.tiles.clone();
      for (const point of this.map.tiles.keys()) {
        const neighbors = this.getWalls(clone, point);
        const isWall = neighbors.length / 9 >= this.wallPercentage;
        this.map.add(point, isWall ? TileType.WALL : TileType.FLOOR);
      }
      this.map.snapshot();
      this.gen++;
    }
  }
}
