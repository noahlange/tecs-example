import * as ROT from 'rot-js';

import { World } from 'tecs';
import { Core } from './entities';
import Stats from 'stats.js';

import {
  Actions,
  Input,
  Dialogue,
  DiggerMap,
  UI,
  Lighting,
  PIXI
} from './systems';

import { HEIGHT, WIDTH } from './utils';

class MyWorld extends World.with(
  DiggerMap,
  Input,
  Actions,
  Dialogue,
  Lighting,
  PIXI,
  UI
) {
  protected ts: number = 0;
  protected stats: Stats | null = null;
  protected initStats(): void {
    this.stats = new Stats();
    this.stats.showPanel(1);
    document.body.appendChild(this.stats.dom);
  }

  public tick(d: number, ts: number): void {
    this.stats?.begin();
    super.tick(d, ts);
    this.stats?.end();
  }

  public init(): void {
    this.create(Core, { game: { width: WIDTH, height: HEIGHT } });
    this.initStats();
  }
}

(async () => {
  const world = new MyWorld();
  await world.start();
})();
