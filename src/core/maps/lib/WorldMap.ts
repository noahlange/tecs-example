import type { CollisionMethods, Size, Vector2 } from '../../../lib/types';
import type { Game } from '@core';
import type { Projection } from '@lib/enums';

import { FOV, Pathfinding } from 'malwoden';

interface WorldMapOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export abstract class WorldMap {
  protected point: Vector2;
  protected game: Game;
  protected size: Size;

  public fov: FOV.PreciseShadowcasting;
  public paths: Pathfinding.AStar;

  public projection: Projection | null = null;

  public get x(): number {
    return this.point.x;
  }

  public get y(): number {
    return this.point.y;
  }

  public get width(): number {
    return this.size.width;
  }

  public get height(): number {
    return this.size.height;
  }

  public abstract collisions: CollisionMethods;
  public abstract generate(): Promise<void>;
  public abstract getSpawn(): Vector2;

  public constructor(game: Game, options: WorldMapOptions) {
    this.game = game;
    this.point = { x: options.x, y: options.y };
    this.size = { width: options.width, height: options.height };
    this.paths = new Pathfinding.AStar({
      topology: 'four',
      isBlockedCallback: point => this.collisions.isObstacle(point)
    });

    this.fov = new FOV.PreciseShadowcasting({
      lightPasses: point => !this.collisions.isObstruction(point),
      topology: 'four',
      cartesianRange: true
    });
  }
}
