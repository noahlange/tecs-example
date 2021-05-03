import type { TiledMap } from '@utils/tiled';

import { MapBuilder } from '@lib';
import { Collision } from '@lib/enums';
import { iterateGrid } from '@utils/geometry';
import { getTileIdentifier } from '@utils/tiled';

import map from '../../../../static/iso/tiled-map.json';

export class Builder extends MapBuilder {
  public tiled: TiledMap = map;

  public generate(): void {
    const getIdentifier = getTileIdentifier(this.tiled.tilesets);
    this.width = map.width;
    this.height = map.height;

    for (const layer of map.layers) {
      let index = 0;
      for (const point of iterateGrid(this)) {
        // @todo - get tiledata from tileset
        this.map.add(point, {
          spriteKey: getIdentifier(layer.data[index]),
          collision: Collision.NONE
        });
        index++;
      }
    }

    this.map.snapshot();
  }
}
