import { Player } from '@ecs/entities';
import { player } from '@ecs/prefabs';
import { Scene } from '@lib';
import { toChunkPosition } from '@utils';

const START = { x: 0, y: 0 };

export class MapGen extends Scene {
  public init(): void {
    const playerEntity = this.game.ecs.query.entities(Player).first();
    const entity = playerEntity ?? this.game.ecs.create(Player, player.data);
    const [chunk] = toChunkPosition(entity.$.position);

    if (!playerEntity) {
      this.game.once('init.area', area => {
        const { x, y } = area.getSpawn(START);
        entity.$.position.x = x;
        entity.$.position.y = y;
      });
    }

    this.game.$.map.area.center = chunk ?? START;
  }
}
