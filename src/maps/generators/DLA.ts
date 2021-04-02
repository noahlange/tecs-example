import { MapBuilder, Rectangle } from '@lib';
import type { Vector2 } from '@types';

import { TileType } from '@enums';

import type { MapBuilderOpts } from '../../lib/MapBuilder';
import { clamp, getRandomNeighbor, RNG } from '@utils';

enum Algorithm {
  INWARDS = 0,
  OUTWARDS = 1,
  // @todo need line
  CENTER = 2
}

const deltas: Vector2[] = [
  { x: 0, y: 0 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 }
];

interface DiffusionLimitedAggregationOpts extends MapBuilderOpts {
  percentage?: number;
}

export class DiffusionLimitedAggregation extends MapBuilder {
  public static pct = 0.375;

  protected algorithm: Algorithm = Algorithm.INWARDS;
  protected count = 0;
  protected brush = 3;

  protected get max(): number {
    return Math.round(
      this.width * this.height * DiffusionLimitedAggregation.pct
    );
  }

  protected drawPoint(point: Vector2): void {
    for (const p of this.getBrushPoints(point)) {
      this.map.add(p, TileType.FLOOR);
      this.count++;
    }
  }

  protected getRandomNeighbor(point: Vector2): Vector2 {
    return getRandomNeighbor(
      point,
      new Rectangle({ x1: 2, y1: 2, x2: this.width - 2, y2: this.height - 2 })
    );
  }

  protected algos = {
    [Algorithm.INWARDS]: () => {
      const digger = {
        x: RNG.int.between(1, this.width - 3) + 1,
        y: RNG.int.between(1, this.height - 3) + 1
      };

      const prev = { x: digger.x, y: digger.y };

      while (this.map.tiles.is(digger, TileType.WALL)) {
        prev.x = digger.x;
        prev.y = digger.y;

        const next = this.getRandomNeighbor(digger);

        digger.x = clamp(next.x, 2, this.width - 2);
        digger.y = clamp(next.y, 2, this.height - 2);
      }

      this.drawPoint(prev);
      this.map.snapshot();
    },
    [Algorithm.OUTWARDS]: () => {
      let digger = {
        x: Math.floor(this.width / 2),
        y: Math.floor(this.height / 2)
      };

      while (!this.map.tiles.is(digger, TileType.WALL)) {
        const next = this.getRandomNeighbor(digger);
        if (next) {
          digger = next;
        } else {
          break;
        }
      }

      this.drawPoint(digger);
      this.map.snapshot();
    }
  };

  public generate(): void {
    const start = {
      x: Math.floor(this.width / 2),
      y: Math.floor(this.height / 2)
    };

    for (const delta of deltas) {
      this.map.add(
        { x: start.x + delta.x, y: start.y + delta.y },
        TileType.FLOOR
      );
    }

    this.count = deltas.length;

    while (this.count < this.max) {
      this.algos[Algorithm.INWARDS]();
    }

    this.map.snapshot();
  }

  public constructor(options: DiffusionLimitedAggregationOpts) {
    super(options);
  }
}

export { DiffusionLimitedAggregation as Builder };
