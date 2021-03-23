import type { Vector2 } from '@types';
import { Pathfinding } from 'malwoden';
import type { MapBuilder } from '../maps/MapBuilder';
import { CollisionMap } from './CollisionMap';

export class Chunk {
  public map: MapBuilder;
  public paths: Pathfinding.AStar;
  public collisions: CollisionMap;

  protected point: Vector2;
  protected generated: boolean = false;

  public get x(): number {
    return this.point.x;
  }

  public get y(): number {
    return this.point.y;
  }

  public get loaded(): boolean {
    return this.generated;
  }

  public unload(): void {
    this.generated = false;
  }

  public load(): void {
    this.map.generate();
    this.generated = true;
  }

  public constructor(coords: Vector2, builder: MapBuilder) {
    this.point = coords;
    this.map = builder;
    this.collisions = new CollisionMap(this.map.bounds);
    this.paths = new Pathfinding.AStar({
      isBlockedCallback: pt => !this.collisions.isPassable(pt),
      topology: 'four'
    });
  }
}
