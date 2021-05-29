import type { WorldMap } from '@core/maps';
import type { CollisionMethods, Vector2 } from '@lib/types';
import type { Pathfinding } from 'malwoden';

import { StaticMap } from '@core/maps';
import { Manager } from '@lib';

export class MapManager extends Manager {
  public world!: WorldMap;

  public get x(): number {
    return this.world.x;
  }

  public get y(): number {
    return this.world.y;
  }

  public get collisions(): CollisionMethods {
    return this.world.collisions;
  }

  public get pathfinding(): Pathfinding.AStar {
    return this.world.paths;
  }

  public getPath(start: Vector2, end: Vector2): Vector2[] {
    const path = this.world.paths.compute(start, end) ?? [];
    return path.slice(1).concat(end);
  }

  public toJSON(): object {
    return { area: this.world };
  }

  public async init(): Promise<void> {
    const options = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      map: '/static/maps/frontier_plains.json'
    };
    this.world = new StaticMap(this.game, options);

    await this.world.generate();
    // this.world = new ChunkMap(this.game, options);
  }
}
