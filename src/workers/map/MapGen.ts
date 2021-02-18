import * as ROT from 'rot-js';
import type { Point, RGBColor } from '../../types';
import { T } from '../../utils/tiles';

export interface MapGenResult {
  entity: string;
  data: any;
}

export abstract class MapGen {
  protected map!: InstanceType<typeof ROT.Map.Cellular | typeof ROT.Map.Digger>;
  protected items: MapGenResult[] = [];
  protected width: number;
  protected height: number;

  protected addPlayer(position: Point): void {
    this.items.push({ entity: 'Player', data: { position } });
  }

  protected addGoblin(position: Point): void {
    this.items.push({ entity: 'Goblin', data: { position } });
  }

  protected addLight(position: Point, color?: RGBColor): void {
    this.items.push({
      entity: 'Light',
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

  protected addCell(position: Point, isWall: boolean): void {
    this.items.push({
      entity: 'Cell',
      data: {
        position,
        collision: { passable: !isWall, allowLOS: !isWall },
        glyph: { text: isWall ? T.WALL : T.SPACE, fg: null }
      }
    });
  }

  protected abstract generate(): MapGenResult[];

  public constructor(width: number, height: number) {
    ROT.RNG.setSeed(12345);
    this.width = width;
    this.height = height;
  }
}
