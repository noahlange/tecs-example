import * as PIXI from 'pixi.js';
import { Direction } from '@enums';

export async function getSpritesheetFromTexture(
  texture: PIXI.Texture,
  atlas: unknown
): Promise<PIXI.Spritesheet> {
  return new Promise(resolve => {
    const spritesheet = new PIXI.Spritesheet(texture, atlas);
    spritesheet.parse(() => resolve(spritesheet));
  });
}

export function getTransformFromDirection(d: Direction): [number, number] {
  switch (d) {
    case Direction.N:
    case Direction.S:
      return [0, 0];
    case Direction.W:
    case Direction.NW:
    case Direction.SW:
      return [1, 1];
    case Direction.E:
    case Direction.NE:
    case Direction.SE:
      return [-1, 1];
  }
}
