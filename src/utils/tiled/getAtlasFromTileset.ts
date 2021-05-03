import type { Atlas, AtlasFrame } from '../../lib/types';
import type { TiledTileset } from './types';

import { iterateGrid } from '../geometry';

export function getAtlasFromTileset(tileset: TiledTileset): Atlas {
  const { imagewidth, imageheight, tilewidth, tileheight, name } = tileset;

  const frames: Record<string, AtlasFrame> = {};
  const tiles = tileset.tiles ?? [];
  let index = 0;

  const bounds = {
    width: imagewidth / tilewidth,
    height: imageheight / tileheight
  };

  for (const point of iterateGrid(bounds)) {
    const x = point.x * tilewidth;
    const y = point.y * tileheight;

    const props = tiles[index]?.properties ?? [];
    const i = index.toString().padStart(3, '0');
    frames[i] = {
      id: i,
      frame: { x, y, w: tilewidth, h: tileheight },
      properties:
        props.reduce((a, b) => ({ ...a, [b.name]: b.value }), {}) ?? {}
    };
    index++;
  }

  return {
    meta: {
      name,
      image: tileset.image,
      scale: '1',
      size: {
        width: imagewidth,
        height: imageheight
      }
    },
    frames
  };
}

export function getAtlasesFromTilesets(
  tilesets: TiledTileset[]
): Record<string, Atlas> {
  return tilesets
    .map(getAtlasFromTileset)
    .reduce((a, b) => ({ ...a, [b.meta.name]: b }), {});
}
