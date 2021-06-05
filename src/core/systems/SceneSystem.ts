import type { Context } from 'tecs';

const fps = 1000 / 30;
let delta: number = 0;

export async function SceneSystem(
  ctx: Context,
  dt: number,
  ts: number
): Promise<void> {
  const scene = ctx.game.scene;
  if (scene) {
    await scene.tick?.(dt, ts);
    delta += dt;
    if (delta >= fps) {
      delta = 0;
      scene.render?.();
    }
  }
}
