import type { TiledMap } from '@utils/tiled';

import { Player } from '@core/entities';
import { StaticMap } from '@core/maps';
import { getPlayerPrefab } from '@core/prefabs';
import { Scene } from '@lib';
import { jsonz } from '@utils';

export class MapGen extends Scene {
  public async start(): Promise<void> {
    this.game.on('init.map.static', async () => {
      const { data, tags } = await getPlayerPrefab();
      this.game.ctx.create(Player, data, tags);
    });

    const tiled = await jsonz.read<TiledMap>('/static/maps/frontier_plains');
    const map = new StaticMap(this.game, tiled);
    await map.generate();
    this.game.$.map.world = map;
  }
}
