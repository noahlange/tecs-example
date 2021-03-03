import * as PIXI from 'pixi.js';
import type { Color } from 'rot-js/lib/color';
import { Direction } from './enums';

export async function getSpritesheetFromTexture(
  texture: PIXI.Texture,
  atlas: unknown
): Promise<PIXI.Spritesheet> {
  return new Promise(resolve => {
    const spritesheet = new PIXI.Spritesheet(texture, atlas);
    spritesheet.parse(() => resolve(spritesheet));
  });
}

// https://stackoverflow.com/a/5623914
export function toHex([r, g, b]: Color): number {
  return parseInt(
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
    16
  );
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
