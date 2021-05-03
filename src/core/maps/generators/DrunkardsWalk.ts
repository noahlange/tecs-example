import type { Vector2 } from '../../../lib/types';

import { MapBuilder } from '@lib';
import { Collision, TileType } from '@lib/enums';
import { CHUNK_HEIGHT, CHUNK_WIDTH, isObstacle } from '@utils';
import { getRandomNeighbor } from '@utils/geometry';

export class Builder extends MapBuilder {
  public static tiles = CHUNK_WIDTH * CHUNK_HEIGHT * 0.375;

  protected cleared: number = 0;
  protected current: Vector2 | null = null;
  protected lifetime: number = 250;
  protected brush: number = 2;

  protected drawPoint(point: Vector2): void {
    if (!isObstacle(this.map.tiles.get(point)?.collision)) {
      for (const pt of this.getBrushPoints(point)) {
        this.map.add(pt, {
          spriteKey: TileType.FLOOR,
          collision: Collision.NONE
        });
      }
      this.cleared++;
    }
    this.current = point;
  }

  public generate(): void {
    this.current = this.map.bounds.center;

    while (this.cleared < Builder.tiles) {
      this.lifetime = CHUNK_WIDTH * CHUNK_HEIGHT * 0.125;
      this.drawPoint(this.current);
      while (this.lifetime > 0) {
        const next = getRandomNeighbor(this.current!, this.map.bounds);
        this.lifetime--;
        this.drawPoint(next);
        this.map.snapshot();
      }
      this.current = this.getRandomPoint();
    }
  }
}
