import * as ROT from 'rot-js';
import { World } from 'tecs';

import { Actions, Input, MapGen, Renderer, Lighting } from './systems';
import { timer } from './utils';

ROT.RNG.setSeed(123454321);

class MyWorld extends World.with(MapGen, Input, Actions, Lighting, Renderer) {
  @timer('tick', false)
  public tick(delta: number, timestamp: number): void {
    super.tick(delta, timestamp);
  }

  @timer('init')
  public async start(): Promise<void> {
    await super.start?.();
  }
}

(async () => {
  const world = new MyWorld();
  world.start().then(() => {
    world.tick(0, Date.now());
  });
})();
