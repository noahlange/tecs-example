import * as PIXI from 'pixi.js';
import type { Color } from 'rot-js/lib/color';
import { Direction } from '../types';

export async function getSpritesheetFromTexture(
  texture: PIXI.Texture,
  atlas: unknown
): Promise<PIXI.Spritesheet> {
  return new Promise(resolve => {
    const spritesheet = new PIXI.Spritesheet(texture, atlas);
    spritesheet.parse(() => resolve(spritesheet));
  });
}

export function dirToRotation(direction: Direction): number {
  switch (direction) {
    case Direction.N:
      return 0;
    case Direction.NE:
      return 45;
    case Direction.E:
      return 90;
    case Direction.SE:
      return 135;
    case Direction.S:
      return 180;
    case Direction.SW:
      return 225;
    case Direction.W:
      return 270;
    case Direction.NW:
      return 315;
  }
}

// https://stackoverflow.com/a/5623914
export function toHex([r, g, b]: Color): number {
  return parseInt(
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
    16
  );
}
