import Stats from 'stats.js';
import { Context } from 'tecs';

import { Display, Logic, SceneSystem } from './systems';

export class ECS extends Context.with(SceneSystem, Display, Logic) {
  protected ts: number = 0;
  protected stats: Stats | null = null;

  protected initStats(): void {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
  }

  /**
   * For manually-invoking the entity manager's tick() method, due to the hybrid ecs/non-ecs approach
   */
  public async update(): Promise<void> {
    this.manager.tick();
  }

  public async tick(d: number, ts: number): Promise<void> {
    this.stats?.begin();
    await super.tick(d, ts);
    this.stats?.end();
  }

  public async start(): Promise<void> {
    this.initStats();
    await super.start();
  }
}
