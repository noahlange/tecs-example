import type { TiledLayer } from '../utils/tiled/types';
import type { Projection } from '@lib/enums';
import type { Vector3 } from '@lib/types';
import type { Spritesheet } from '@pixi/spritesheet';
import type { TiledMap, TiledTileset } from '@utils/tiled';

import { jsonz } from '@utils';
import { iterateGrid } from '@utils/geometry';
import { getSpritesheetsFromTilesets } from '@utils/pixi';
import { getProjectionFromTiledMap, getTileIdentifier } from '@utils/tiled';

interface IterableLayer extends TiledLayer {
  [Symbol.iterator](): IterableIterator<[Vector3, string | null]>;
}

export class Tiled {
  public static async from(source: string): Promise<Tiled> {
    const tiled = new Tiled(source);
    await tiled.load();
    return tiled;
  }

  protected source: string;
  protected tilesets: TiledTileset[] = [];
  protected tilemap!: TiledMap;
  protected getID!: (index: number) => string;

  public get width(): number {
    return this.tilemap.width;
  }

  public get height(): number {
    return this.tilemap.height;
  }

  public get projection(): Projection {
    return getProjectionFromTiledMap(this.tilemap);
  }

  public get layers(): IterableLayer[] {
    const [tilemap, getID] = [this.tilemap, this.getID.bind(this)];
    return this.tilemap.layers.map(
      (layer, z): IterableLayer => {
        return {
          ...layer,
          *[Symbol.iterator](): IterableIterator<[Vector3, string | null]> {
            let i = 0;
            for (const point of iterateGrid(tilemap)) {
              const index = layer.data?.[i++] ?? null;
              yield [{ ...point, z }, index ? getID(index) : null];
            }
          }
        };
      }
    );
  }

  public async load(): Promise<void> {
    this.tilemap = await jsonz.read(this.source);
    this.getID = getTileIdentifier(this.tilemap.tilesets);
    this.tilesets = await Promise.all(
      this.tilemap.tilesets.map(tileset => {
        return tileset.source
          ? import(/* @vite-ignore */ tileset.source).then(m => m.default)
          : Promise.resolve(tileset);
      }) ?? []
    );
  }

  public async getSpritesheets(): Promise<{ [key: string]: Spritesheet }> {
    return getSpritesheetsFromTilesets(this.tilesets);
  }

  protected constructor(source: string) {
    this.source = source;
  }
}
