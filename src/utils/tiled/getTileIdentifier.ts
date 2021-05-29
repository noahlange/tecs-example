import type { TiledTileset } from './types';

interface GetTileFunction {
  (id: number): string;
}

export function getTilesetName(tileset: TiledTileset): string {
  const source = tileset.name ?? tileset.image ?? tileset.source;
  const popped = source.split('/').pop() ?? source;
  return popped.replace(/\.(json|png)/, '');
}

export function getTileIdentifier(tilesets: TiledTileset[]): GetTileFunction {
  // sort descending

  const sources = tilesets
    .sort((a, b) => b.firstgid - a.firstgid)
    .map(tileset => ({
      name: getTilesetName(tileset),
      firstgid: tileset.firstgid
    }));

  return (id: number) => {
    for (const { name, firstgid } of sources) {
      if (firstgid <= id) {
        const tileID = id - firstgid;
        return [name, tileID.toString().padStart(3, '0')].join('.');
      }
    }
    return id.toString();
  };
}
