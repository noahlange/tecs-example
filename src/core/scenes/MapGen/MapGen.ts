import type { ChunkMap } from '@core/maps';

import { Player } from '@core/entities';
import { player } from '@core/prefabs';
import { Scene } from '@lib';
import { toChunkPosition } from '@utils/geometry';

const START = { x: 0, y: 0 };

export class MapGen extends Scene {
  public init(): void {
    const playerEntity = this.game.ecs.query.entities(Player).first();
    const entity = playerEntity ?? this.game.ecs.create(Player, player.data);
    const [chunk] = toChunkPosition(entity.$.position);

    if (!playerEntity) {
      this.game.once('init.map.chunks', map => {
        const { x, y } = map.getSpawn(START);
        entity.$.position.x = x;
        entity.$.position.y = y;
      });

      this.game.once('init.map.static', () => {
        entity.$.position.x = 16;
        entity.$.position.y = 16;
      });
    }

    (this.game.$.map.world as ChunkMap).center = chunk ?? START;
  }
}
