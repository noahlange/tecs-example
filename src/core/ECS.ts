import Stats from 'stats.js';
import { Context } from 'tecs';

import * as Components from './components';
import * as Entities from './entities';
import {
  Animation,
  Camera,
  Collisions,
  Interact,
  Inventory,
  Items,
  Lighting,
  Movement,
  Pathfinding,
  Renderer,
  Scenes,
  View
} from './systems';

export class ECS extends Context.with(
  Scenes,
  Pathfinding,
  Collisions,
  Movement,
  Interact,
  Inventory,
  Items,
  View,
  Lighting,
  Renderer,
  Camera,
  Animation
) {
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

  public constructor() {
    super();
    const components = Object.values(Components);
    const entities = Object.values(Entities);
    this.register(...entities, ...components);
  }
}

export { Entities };
