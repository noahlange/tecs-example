import type { ChunkMap } from '@core/maps';

import { Player } from '@core/entities';
import { player } from '@core/prefabs';
import { Scene } from '@lib';
import { toChunkPosition } from '@utils/geometry';

const START = { x: 0, y: 0 };

export class MapGen extends Scene {
  public init(): void {
    const playerEntity = this.game.ctx.$.entities(Player).first();
    const entity =
      playerEntity ?? this.game.ctx.create(Player, player.data, player.tags);

    // if (entity) {
    //   this.game.once('init.map.chunks', map => {
    //     const { x, y } = map.getSpawn(START);
    //     entity.$.position.x = x;
    //     entity.$.position.y = y;
    //   });

    //   this.game.once('init.map.static', () => {
    //     entity.$.position.x = 8;
    //     entity.$.position.y = 8;
    //   });
    // }

    // (this.game.$.map.world as ChunkMap).center = chunk ?? START;
  }
}
