import type { Pathfinding } from 'malwoden';
import type { Entity } from 'tecs';
import type { Vector2 } from '@types';
import type { CollisionMethods } from '@lib';

import { Manager, Area } from '@lib';

export class MapManager extends Manager {
  public area!: Area;
  public entities: Set<Entity> = new Set();

  public get x(): number {
    return this.area.x;
  }

  public get y(): number {
    return this.area.y;
  }

  public get collisions(): CollisionMethods {
    return this.area.collisions;
  }

  public get pathfinding(): Pathfinding.AStar {
    return this.area.paths;
  }

  public getPath(start: Vector2, end: Vector2): Vector2[] {
    const path = this.area.paths.compute(start, end) ?? [];
    return path.slice(1).concat(end);
  }

  public toJSON(): object {
    return { area: this.area };
  }

  public init(): void {
    this.area = new Area(this.game, { x: 0, y: 0 });
  }
}
