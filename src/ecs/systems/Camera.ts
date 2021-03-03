import type { EntityType } from 'tecs';
import { System } from 'tecs';

import { Playable, Position } from '../components';

export class Camera extends System {
  public static readonly type = 'camera';

  protected player!: EntityType<[typeof Position, typeof Playable]>;

  public tick(): void {
    this.world.game.$.renderer.follow(this.player.$.position);
  }

  public init(): void {
    this.player = this.world.query.components(Playable, Position).find();
  }
}
