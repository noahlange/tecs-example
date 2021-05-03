import { Position } from '@core/components';
import { Player } from '@core/entities';
import { Tag } from '@lib/enums';
import { System } from 'tecs';

import { Gameplay } from '../../core/scenes/Gameplay';

export class Camera extends System {
  public static readonly type = 'camera';

  protected $ = {
    player: this.world.query.entities(Player).persist(),
    camera: this.world.query.tags(Tag.IS_CAMERA).components(Position).persist()
  };

  protected player: Player | null = null;

  public tick(): void {
    if (this.world.game.scene instanceof Gameplay) {
      this.player ??= this.$.player.first();
      if (this.player) {
        const pos = this.player.$.position;
        this.world.game.$.renderer.follow(pos);
        const area = this.world.game.$.map.world;
        const [next] = pos.chunk;
        if (next.x !== area.x || next.y !== area.y) {
          // @ts-ignore: @todo fix
          area.center = next;
        }
      }
    } else {
      const camera = this.$.camera.first();
      if (camera) {
        this.world.game.$.renderer.follow(camera.$.position);
      }
    }
  }
}
