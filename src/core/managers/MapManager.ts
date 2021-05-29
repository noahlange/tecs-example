import type { WorldMap } from '@core/maps';
import type { CollisionMethods, Vector2 } from '@lib/types';
import type { Pathfinding } from 'malwoden';

import { Manager } from '@lib';
import { Projection } from '@lib/enums';

export class MapManager extends Manager {
  public world!: WorldMap;

  public get x(): number {
    return this.world.x;
  }

  public get y(): number {
    return this.world.y;
  }

  public get projection(): Projection {
    return this.world?.projection ?? Projection.ORTHOGRAPHIC;
  }

  public get collisions(): CollisionMethods {
    return (
      this.world?.collisions ?? {
        isObstacle: () => false,
        isObstruction: () => false,
        set: () => void 0
      }
    );
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
}
