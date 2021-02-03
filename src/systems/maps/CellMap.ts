import * as ROT from 'rot-js';

import { GameMap } from '../../entities';
import { HEIGHT, WIDTH } from '../../utils';
import { MapGen } from './MapGen';

export class CellMap extends MapGen {
  public static readonly type = 'map';

  protected map!: InstanceType<typeof ROT.Map.Cellular>;

  protected generate(): void {
    const data: Record<string, number> = {};

    this.world.create(GameMap, { game: { width: WIDTH, height: HEIGHT } });
    this.map = new ROT.Map.Cellular(WIDTH, HEIGHT);
    this.map.randomize(0.5);

    for (let i = 0; i < 4; i++) {
      this.map.create((x, y, value) => {
        data[x + ' ' + y] = value;
      });
    }

    for (const key in data) {
      const [x, y] = key.split(' ').map(i => +i);
      this.addCell({ x, y }, data[key] === 0);
    }

    this.addLight({ x: 12, y: 12 }, [240, 240, 30]);
    this.addLight({ x: 20, y: 20 }, [240, 60, 60]);
    this.addLight({ x: 45, y: 25 }, [200, 200, 200]);
    this.addPlayer({ x: 12, y: 12 });
  }
}
