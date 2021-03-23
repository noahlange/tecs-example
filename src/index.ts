import { MapGen } from '@core/scenes';
import * as PIXI from 'pixi.js';

window.LOAD_TEST = false;
window.PIXI = PIXI;

(async () => {
  const { Game } = await import('./core/Game');
  const { Gameplay } = await import('./core/scenes');

  const game = new Game();
  // @todo - fix lighting issue here
  await game.start();
  game.$.scenes.push(Gameplay);
})();
