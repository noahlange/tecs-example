import { System } from 'tecs';

export class Scenes extends System {
  public static readonly type = 'scenes';

  public delta: number = 0;
  public ms = 1000 / 30;

  public tick(dt: number, ts: number): void {
    const scene = this.world.game.scene;

    if (scene) {
      scene.tick?.(dt, ts);
      this.delta += dt;
      if (this.delta >= this.ms) {
        this.delta = 0;
        scene.render?.();
      }
    }
  }
}
