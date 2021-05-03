import type { Atlas } from '../../lib/types';
import type { TiledTileset } from '../tiled/types';

import * as PIXI from 'pixi.js';

import { getAtlasFromTileset } from '../tiled/getAtlasFromTileset';

export async function getSpritesheetFromTexture(
  texture: PIXI.Texture,
  atlas: Atlas
): Promise<PIXI.Spritesheet> {
  const spritesheet = new PIXI.Spritesheet(texture, atlas);
  return new Promise(resolve => spritesheet.parse(() => resolve(spritesheet)));
}

export async function getSpritesheetFromURL(
  url: string,
  atlas: Atlas
): Promise<PIXI.Spritesheet> {
  const texture = await PIXI.Texture.fromURL(url);
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
  return getSpritesheetFromTexture(texture, atlas);
}

export async function getSpritesheetFromTileset(
  tileset: TiledTileset,
  atlas: Atlas = getAtlasFromTileset(tileset)
): Promise<PIXI.Spritesheet> {
  return getSpritesheetFromURL(tileset.image, atlas);
}

export async function getSpritesheetsFromTilesets(
  tilesets: TiledTileset[]
): Promise<Record<string, PIXI.Spritesheet>> {
  const res = await Promise.all(
    tilesets.map(async tileset => {
      const atlas = getAtlasFromTileset(tileset);
      const sprites = await getSpritesheetFromTileset(tileset, atlas);
      return { atlas, sprites };
    })
  );

  return res.reduce((a, b) => {
    return { ...a, [b.atlas.meta.name]: b.sprites };
  }, {});
}
