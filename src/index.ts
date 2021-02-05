import { World } from 'tecs';
import { Core } from './entities';
import Stats from 'stats.js';

import { Actions, Input, Renderer, Lighting, DiggerMap, UI } from './systems';
import { Dialogue } from './systems/Dialogue';
import { HEIGHT, WIDTH } from './utils';

class MyWorld extends World.with(
  DiggerMap,
  Input,
  Actions,
  Lighting,
  Renderer,
  Dialogue,
  UI
) {
  protected ts: number = 0;
  protected stats: Stats | null = null;
  protected initStats(): void {
    this.stats = new Stats();
    this.stats.showPanel(2);
    document.body.appendChild(this.stats.dom);
  }

  public tick(d: number, ts: number): void {
    this.stats?.begin();
    super.tick(d, ts);
    this.stats?.end();
  }

  /**
   * Allows us to wrap tick() a little more cleanly for stats.js
   */
  public step(time: number): void {
    this.tick(time - this.ts, time);
    window.requestAnimationFrame(t => this.step(t));
  }

  public init(): void {
    this.create(Core, { game: { width: WIDTH, height: HEIGHT } });
    this.initStats();
  }
}

(async () => {
  const world = new MyWorld();
  await world.start();
  world.step(0);
})();
