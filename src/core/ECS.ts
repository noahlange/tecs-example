import Stats from 'stats.js';
import { World } from 'tecs';

import * as Components from './components';
import * as Entities from './entities';
import {
  Animation,
  Camera,
  Collisions,
  Interact,
  Inventory,
  Lighting,
  Movement,
  Pathfinding,
  Renderer,
  Scenes,
  View
} from './systems';

export class ECS extends World.with(
  Scenes,
  Pathfinding,
  Collisions,
  Movement,
  Interact,
  Inventory,
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
    this.stats.showPanel(1);
    document.body.appendChild(this.stats.dom);
  }

  /**
   * For manually-invoking the entity manager's tick() method, due to the hybrid ecs/non-ecs approach
   */
  public update(): void {
    this.manager.tick();
  }

  public tick(d: number, ts: number): void {
    this.stats?.begin();
    super.tick(d, ts);
    this.stats?.end();
  }

  public init(): void {
    this.initStats();
  }

  public constructor() {
    super();
    const components = Object.values(Components);
    const entities = Object.values(Entities);
    this.register(...entities, ...components);
  }
}

export { Entities };