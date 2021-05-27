import type { GameTileData, Vector2Array } from '@lib';
import type { Vector2 } from '@lib/types';

import { MapBuilder } from '@lib';
import { Collision, TileType } from '@lib/enums';
import { isObstacle, RNG } from '@utils';
import { iterateGrid } from '@utils/geometry';

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
  protected getWalls(
    map: Vector2Array<GameTileData>,
    point: Vector2
  ): Vector2[] {
    return deltas
      .map(d => ({ x: point.x + d.x, y: point.y + d.y }))
      .filter(tile => isObstacle(map.get(tile)?.collision));
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

    for (const point of iterateGrid(this)) {
      const roll = RNG.float();
      const isWall = roll < this.wallPercentage;
      this.map.add(point, {
        spriteKey: isWall ? TileType.WALL : TileType.FLOOR,
        collision: isWall ? Collision.OBSTACLE : Collision.NONE
      });
    }

    while (this.gen < this.gens) {
      const clone = this.map.tiles.clone();
      for (const point of this.map.tiles.keys()) {
        const neighbors = this.getWalls(clone, point);
        const isWall = neighbors.length / 9 >= this.wallPercentage;
        this.map.add(point, {
          spriteKey: isWall ? TileType.WALL : TileType.FLOOR,
          collision: isWall ? Collision.OBSTACLE : Collision.NONE
        });
      }
      this.map.snapshot();
      this.gen++;
    }
  }
}
