import { Player } from '@ecs/entities';

import { System } from 'tecs';
import { Gameplay } from '@core/scenes';

export class Camera extends System {
  public static readonly type = 'camera';

  protected $ = {
    player: this.world.query.entities(Player).persist()
  };

  protected player: Player | null = null;

  public tick(): void {
    if (this.world.game.scene instanceof Gameplay) {
      this.player ??= this.$.player.first();
      if (this.player) {
        const pos = this.player.$.position;
        this.world.game.$.renderer.follow(pos);
        const area = this.world.game.$.map.area;
        const [next] = pos.chunk;
        if (next.x !== area.x || next.y !== area.y) {
          area.center = next;
        }
      }
    }
  }
}
