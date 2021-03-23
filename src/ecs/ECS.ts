import { World } from 'tecs';
import Stats from 'stats.js';

import * as Components from './components';
import * as Entities from './entities';

import {
  AI,
  Collisions,
  Pathfinding,
  Interact,
  View,
  Renderer,
  Movement,
  Camera,
  Inventory,
  Scenes,
  Items,
  Combat,
  Overlays
} from './systems';

export class ECS extends World.with(
  Scenes,
  Inventory,
  AI,
  Pathfinding,
  Interact,
  Items,
  Combat,
  Collisions,
  Movement,
  View,
  Overlays,
  Renderer,
  Camera
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
