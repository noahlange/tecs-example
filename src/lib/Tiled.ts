import type { Projection } from '@lib/enums';
import type { Vector3 } from '@lib/types';
import type { Spritesheet } from '@pixi/spritesheet';
import type { TiledMap, TiledTileset } from '@utils/tiled';

import { iterateGrid } from '@utils/geometry';
import { getSpritesheetsFromTilesets } from '@utils/pixi';
import { getProjectionFromTiledMap, getTileIdentifier } from '@utils/tiled';

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

  public get projection(): Projection {
    return getProjectionFromTiledMap(this.tilemap);
  }

  public *[Symbol.iterator](): IterableIterator<[Vector3, string]> {
    let z = 0;
    for (const layer of this.tilemap.layers) {
      let i = 0;
      for (const point of iterateGrid(this.tilemap)) {
        yield [{ ...point, z }, this.getID(layer.data[i++])];
      }
      z++;
    }
  }

  public async load(): Promise<void> {
    this.tilemap = await import(/* @vite-ignore */ this.source);
    this.getID = getTileIdentifier(this.tilemap.tilesets);
    this.tilesets = await Promise.all(
      this.tilemap.tilesets.map(
        tileset => import(/* @vite-ignore */ tileset.source)
      ) ?? []
    );
  }

  public async getSpritesheets(): Promise<{ [key: string]: Spritesheet }> {
    return getSpritesheetsFromTilesets(this.tilesets);
  }

  protected constructor(source: string) {
    this.source = source;
  }
}
