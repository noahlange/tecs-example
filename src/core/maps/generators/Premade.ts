import { MapBuilder } from '@lib';
import { Collision } from '@lib/enums';
import { jsonz } from '@utils';
import { iterateGrid } from '@utils/geometry';
import { getTileIdentifier } from '@utils/tiled';

export class Builder extends MapBuilder {
  public async generate(): Promise<void> {
    const map = await jsonz.read('/static/maps/frontier_plains');
    const getIdentifier = getTileIdentifier(map);
    this.width = map.width;
    this.height = map.height;

    for (const layer of map.layers) {
      if (!layer.data) {
        continue;
      }

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
