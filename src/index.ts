import '@ui/styles/index.scss';

import * as PIXI from 'pixi.js';

// required for PIXI dev tools
window.PIXI = PIXI;
// @ts-ignore: can't blacklist @types
window.global = window.globalThis;

(async () => {
  const { Game } = await import('./core/Game');
  const { Gameplay, MapGen, Menu } = await import('./core/scenes');

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
