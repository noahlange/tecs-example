import type { TiledTilesetReference } from './types';

interface GetTileFunction {
  (id: number): string;
}

export function getTileIdentifier(
  tilesets: TiledTilesetReference[]
): GetTileFunction {
  // sort descending
  const sorted = tilesets.sort((a, b) => b.firstgid - a.firstgid);
  return (id: number) => {
    for (const tileset of sorted) {
      const source = tileset.source.split('/').pop() ?? tileset.source;
      if (tileset.firstgid <= id) {
        const tileID = id - tileset.firstgid;
        return [
          source?.replace('.json', ''),
          tileID.toString().padStart(3, '0')
        ].join('.');
      }
    }
    return id.toString();
  };
}