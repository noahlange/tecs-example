import type { CollisionMethods, Vector2 } from '../../lib/types';
import type { WorldMap } from '@core/maps';
import type { Pathfinding } from 'malwoden';

import { ChunkMap } from '@core/maps';
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

  public init(): void {
    this.world = new ChunkMap(this.game, { x: 0, y: 0, width: 48, height: 48 });
  }
}
