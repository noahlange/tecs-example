import * as ROT from 'rot-js';
import { enemies, items } from '../../data';
import type { Point, Rect, RGBColor, Tag } from '@types';

export interface MapGenEntity {
  entity: string;
  tags: Tag[];
  data: any;
}

export interface MapGenInfo {
  doors: Point[];
  rooms: Rect[];
}

export interface MapGenResult {
  entities: MapGenEntity[];
  map: MapGenInfo;
}

export abstract class MapGen {
  protected map!: InstanceType<typeof ROT.Map.Cellular | typeof ROT.Map.Digger>;
  protected items: MapGenEntity[] = [];
  protected width: number;
  protected height: number;
  protected enemies = 0;

  protected addDoor(position: Point): void {
    this.items.push({
      entity: 'Door',
      tags: [],
      data: { position }
    });
  }

  protected addPlayer(position: Point): void {
    this.items.push({
      entity: 'Player',
      tags: [],
      data: { position }
    });
  }

  protected addEnemy(position: Point): void {
    const item = ROT.RNG.getItem(enemies);
    if (item) {
      const { data } = item;
      const d = {
        ...item,
        data: {
          ...data,
          text: {
            ...data.text,
            title: `${data.text.title} ${this.enemies + 1}`
          },
          ai: {
            ...data.ai,
            home: position
          },
          position
        }
      };

      this.items.push(d);
      this.enemies++;
    }
  }

  protected addItem(position: Point): void {
    const item = ROT.RNG.getItem(items);
    if (item) {
      const { data } = item;
      this.items.push({
        ...item,
        data: { ...data, position }
      });
    }
  }

  protected addLight(position: Point, color?: RGBColor): void {
    this.items.push({
      entity: 'Light',
      tags: [],
      data: {
        position,
        light: {
          color: color ?? [
            ROT.RNG.getUniformInt(50, 100),
            ROT.RNG.getUniformInt(50, 100),
            ROT.RNG.getUniformInt(50, 100)
          ]
        }
      }
    });
  }

  protected addCell(position: Point, isWall: boolean, glyph?: string): void {
    this.items.push({
      entity: 'Cell',
      tags: [],
      data: {
        position,
        collision: { passable: !isWall, allowLOS: !isWall },
        sprite: {
          key: glyph ?? (isWall ? 'wall_01_ew' : 'floor_02_06'),
          tint: [20, 20, 20]
        }
      }
    });
  }

  protected abstract generate(): MapGenResult;

  public constructor(width: number, height: number) {
    ROT.RNG.setSeed(12345);
    this.width = width;
    this.height = height;
  }
}
