import { World } from 'tecs';

import { Actions, Input, Renderer, Lighting, DiggerMap } from './systems';

class MyWorld extends World.with(
  DiggerMap,
  Input,
  Actions,
  Lighting,
  Renderer
) {
  protected ts: number = 0;

  public tick(delta: number, time: number): void {
    super.tick(delta, time);
  }

  public step(time: number): void {
    this.ts = time;
    this.tick(time - this.ts, time);
    window.requestAnimationFrame(t => this.step(t));
  }
}

(async () => {
  const world = new MyWorld();
  await world.start();
  world.step(Date.now());
})();
