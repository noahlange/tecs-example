import { System } from 'tecs';

export class Scenes extends System {
  public static readonly type = 'scenes';

  public tick(d: number, ts: number): void {
    this.world.game.scene?.tick(d, ts);
  }
}
