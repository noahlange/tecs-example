import type { TiledMap } from '@utils/tiled';

import { StaticMap } from '@core/maps';
import { Scene } from '@lib';
import { jsonz } from '@utils';

export class MapGen extends Scene {
  public static source = '/static/maps/frontier_plains';

  public async start(): Promise<void> {
    await this.game.$.map.load(
      new StaticMap(this.game, await jsonz.read<TiledMap>(MapGen.source))
    );
  }
}
