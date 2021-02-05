import * as ROT from 'rot-js';

import { System } from 'tecs';

import { Cell, Light, Player } from '../../entities';
import type { Point, RGBColor } from '../../types';

export abstract class MapGen extends System {
  protected addPlayer(point: Point): void {
    this.world.create(Player, {
      position: point,
      light: { color: [200, 200, 0] },
      glyph: { text: '@', fg: [0, 0, 0] }
    });
  }

  protected addLight(point: Point, color?: RGBColor): void {
    this.world.create(Light, {
      position: point,
      light: {
        color: color ?? [
          ROT.RNG.getUniformInt(50, 150),
          ROT.RNG.getUniformInt(50, 150),
          ROT.RNG.getUniformInt(50, 150)
        ]
      }
    });
  }

  protected addCell(point: Point, isWall: boolean): void {
    this.world.create(Cell, {
      position: point,
      collision: { passable: !isWall, allowLOS: !isWall },
      glyph: { text: isWall ? '#' : ' ', fg: [120, 120, 120] }
    });
  }

  protected abstract generate(): void;

  public init(): void {
    ROT.RNG.setSeed(12345);
    this.generate();
  }
}
