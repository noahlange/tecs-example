import { World } from 'tecs';
import Stats from 'stats.js';

import * as Components from './components';
import * as Entities from './entities';

import {
  Actions,
  Input,
  MapGen,
  UI,
  Lighting,
  PIXI,
  Dialogue,
  Collisions
} from './systems';

import { HEIGHT, WIDTH } from './utils';

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
    const components = Object.values(Components);
    const entities = Object.values(Entities);
    this.register(...entities, ...components);

    this.create(Entities.Core, { game: { width: WIDTH, height: HEIGHT } });
    this.initStats();
  }
}

(async () => {
  const world = new MyWorld();
  await world.start();
})();
