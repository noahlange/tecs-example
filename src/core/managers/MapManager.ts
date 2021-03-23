import type { Vector2 } from '@types';
import type { Pathfinding } from 'malwoden';
import type { Rectangle, CollisionMap } from '@lib';
import type { TileType } from '@enums';
import { Chunk } from '@lib';
import { Manager, Vector2Array } from '@lib';
import { Builder } from '../../maps/generators/Empty';
import { getCirclePoints } from '@utils';

export class MapManager extends Manager {
  protected chunks: Vector2Array<Chunk> = new Vector2Array({ w: 5, h: 5 });
  protected current!: Chunk;

  public update(center: Vector2): void {
    const chunks = new Vector2Array({ w: 5, h: 5 });
    for (const point of getCirclePoints(center, 2)) {
      const chunk =
        this.chunks.get(point) ??
        new Chunk(point, new Builder({ width: 16, height: 16 }));

      if (!chunk.loaded) {
        chunk.load();
      }
      chunks.set(point, chunk);
    }
    this.current = this.chunks.get(center);
  }

  public get x(): number {
    return this.current.x;
  }

  public get y(): number {
    return this.current.y;
  }

  public set chunk(chunk: Chunk) {
    this.current = chunk;
  }

  public get chunk(): Chunk {
    return this.current;
  }

  public get bounds(): Rectangle {
    return this.current.map.bounds;
  }

  public get collisions(): CollisionMap {
    return this.current.collisions;
  }

  public get pathfinding(): Pathfinding.AStar {
    return this.current.paths;
  }

  public getSpawn(): Vector2 {
    return this.current.map.getSpawn();
  }

  public getPath(start: Vector2, end: Vector2): Vector2[] {
    const path = this.current.paths.compute(start, end) ?? [];
    return path.slice(1).concat(end);
  }

  public *entries(): IterableIterator<[Vector2, TileType]> {
    const history = this.current.map.history;
    const final = history[history.length - 1];
    if (final) {
      yield* final.entries();
    }
  }

  public init(): void {
    this.update({ x: 0, y: 0 });
  }
}
