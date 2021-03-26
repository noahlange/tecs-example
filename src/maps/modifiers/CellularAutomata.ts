import type { Vector2Array, GameMap } from '@lib';
import type { Vector2 } from '@types';
import { TileType } from '@enums';

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

export class CellularAutomata {
  protected gen: number = 0;
  protected gens: number = 7;

  protected getWalls(map: Vector2Array<TileType>, point: Vector2): Vector2[] {
    return deltas
      .map(d => ({ x: point.x + d.x, y: point.y + d.y }))
      .filter(tile => map.is(tile, TileType.WALL));
  }

  protected get wallPercentage(): number {
    switch (true) {
      case this.gen === 0:
        return 40 / 100;
      case this.gen < 4:
        return 5 / 9;
      default:
        return 6 / 9;
    }
  }

  public modify(): void {
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

  protected map: GameMap;

  public constructor(map: GameMap) {
    this.map = map;
  }
}
