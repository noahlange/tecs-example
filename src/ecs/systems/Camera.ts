import { Player } from '@ecs/entities';

import { System } from 'tecs';
import { Gameplay } from '@core/scenes';

export class Camera extends System {
  public static readonly type = 'camera';

  protected $ = {
    player: this.world.query.entities(Player).persist()
  };

  protected player!: Player;

  public tick(): void {
    if (this.world.game.scene instanceof Gameplay) {
      const player = this.player ?? this.$.player.first();
      if (player) {
        this.world.game.$.renderer.follow(player.$.position);
        this.player = player;
      }
    }
  }
}
