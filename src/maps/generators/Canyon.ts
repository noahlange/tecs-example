import { MapBuilder } from '@lib';
import { TileType } from '@enums';
import { RNG } from '@utils';
import type { MapBuilderOpts } from '../../lib/MapBuilder';

interface CanyonBuilderOpts extends MapBuilderOpts {
  roughness?: number;
  windiness?: number;
  complexity?: number;
}

export class Builder extends MapBuilder {
  protected roughness: number = 0;
  protected windiness: number = 0;
  protected complexity: number = 1;

  public generate(): void {
    for (let run = 0; run < this.complexity; run++) {
      let [x, y, w] = [Math.floor(this.width / 2), 0, 4];
      this.drawRectangle({ x1: x, y1: y, x2: x + w, y2: y }, TileType.FLOOR);

      while (y < this.height) {
        const rough = RNG.float();
        if (rough <= this.roughness) {
          w += RNG.int.between(-2, 2);
          w = Math.max(3, w);
          w = Math.min(this.width - 3, w);
        }

        const windy = RNG.float();
        if (windy <= this.windiness) {
          x += RNG.int.between(-2, 2);
          x = Math.max(3, x);
          x = Math.min(x, this.width - 3);
        }

        this.drawRectangle({ x1: x, x2: x + w, y1: y, y2: y }, TileType.FLOOR);

        y++;
      }
      this.map.snapshot();
    }
  }

  public constructor(options: CanyonBuilderOpts) {
    super(options);
    const { roughness = 0.65, windiness = 0.55, complexity = 1 } = options;

    this.roughness = roughness;
    this.windiness = windiness;
    this.complexity = complexity;
  }
}
