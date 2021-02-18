import { World } from 'tecs';
import { Core } from './entities';
import Stats from 'stats.js';

import {
  Actions,
  Input,
  MapGen,
  UI,
  Lighting,
  PIXI,
  Dialogue
} from './systems';

import { HEIGHT, WIDTH } from './utils';
import { Collisions } from './systems/Collisions';

class MyWorld extends World.with(
  MapGen,
  Input,
  Collisions,
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
