import type { Point, Size } from '@types';

import { Pathfinding } from 'malwoden';
import { nanoid } from 'nanoid/non-secure';

import { CollisionMap, Manager } from '@lib';
import { map } from '@utils';

export class MapManager extends Manager {
  protected areaID!: string;
  protected areaCollisions: Record<string, CollisionMap> = {};
  protected areaPathfinders: Record<string, Pathfinding.AStar> = {};

  public get size(): Size {
    return {
      w: map.w,
      h: map.h
    };
  }

  public get width(): number {
    return map.w;
  }

  public get height(): number {
    return map.h;
  }

  public get collisions(): CollisionMap {
    return this.areaCollisions[this.areaID];
  }

  public get pathfinding(): Pathfinding.AStar {
    return this.areaPathfinders[this.areaID];
  }

  public getPath(start: Point, end: Point): Point[] {
    const path = this.pathfinding.compute(start, end) ?? [];
    return path.slice(1).concat(end);
  }

  public init(): void {
    const id = (this.areaID = nanoid());
    this.areaCollisions[id] = new CollisionMap(map);
    this.areaPathfinders[id] = new Pathfinding.AStar({
      isBlockedCallback: point => !this.collisions.isPassable(point),
      topology: 'four'
    });
  }
}
