import type { WorldMap } from '@core/maps';
import type { CollisionMethods, Vector2 } from '@lib/types';

import { Manager } from '@lib';
import { Projection } from '@lib/enums';
import { Pathfinding } from 'malwoden';

export class MapManager extends Manager {
  protected world!: WorldMap;

  public get x(): number {
    return this.world?.x ?? 0;
  }

  public get y(): number {
    return this.world?.y ?? 0;
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
    return (
      this.world?.paths ??
      new Pathfinding.AStar({
        isBlockedCallback: () => false,
        topology: 'eight'
      })
    );
  }

  public async load(world: WorldMap): Promise<void> {
    await world.generate();
    this.world = world;
  }

  public getPath(start: Vector2, end: Vector2): Vector2[] {
    const path = this.world.paths.compute(start, end) ?? [];
    return path.slice(1).concat(end);
  }

  public toJSON(): object {
    return { area: this.world };
  }
}
