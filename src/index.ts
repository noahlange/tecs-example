import * as PIXI from 'pixi.js';

window.LOAD_TEST = false;
window.PIXI = PIXI;

(async () => {
  const { Game } = await import('./core/Game');
  const { Gameplay, MapGen } = await import('./core/scenes');

  /**
   * @todo
   * const json = JSON.parse(
   *   window.localStorage.getItem('tecs:save') ?? '{ "ecs": null }'
   * );
   */

  const game = new Game();
  await game.start();

  game.$.scenes.push(MapGen);
  game.$.scenes.push(Gameplay);
})();
