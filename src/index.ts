import * as ROT from 'rot-js';
import { World } from 'tecs';

import { Actions, Input, MapGen, Renderer, Lighting } from './systems';

ROT.RNG.setSeed(123454321);

class MyWorld extends World.with(MapGen, Input, Actions, Lighting, Renderer) {
  public step(timestamp: number): void {
    const delta = timestamp - this.ts;
    this.ts = timestamp;
    this.tick(delta, timestamp);
    window.requestAnimationFrame(t => this.step(t));
  }

  protected ts: number = 0;
}

(async () => {
  const world = new MyWorld();
  await world.start();
  world.step(0);
})();
