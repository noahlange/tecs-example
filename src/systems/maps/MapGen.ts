import * as ROT from 'rot-js';

import { System } from 'tecs';

import { Cell, Light, Player } from '../../entities';
import type { Point, RGBColor } from '../../types';
import { T } from '../../utils/tiles';

export abstract class MapGen extends System {
  protected addPlayer(position: Point): void {
    this.world.create(Player, { position });
  }

  protected addLight(point: Point, color?: RGBColor): void {
    this.world.create(Light, {
      position: point,
      light: {
        color: color ?? [
          ROT.RNG.getUniformInt(50, 100),
          ROT.RNG.getUniformInt(50, 100),
          ROT.RNG.getUniformInt(50, 100)
        ]
      }
    });
  }

  protected addCell(point: Point, isWall: boolean): void {
    this.world.create(Cell, {
      position: point,
      collision: { passable: !isWall, allowLOS: !isWall },
      glyph: { text: isWall ? T.WALL : T.SPACE, fg: null }
    });
  }

  protected abstract generate(): void;

  public init(): void {
    ROT.RNG.setSeed(12345);
    this.generate();
  }
}
