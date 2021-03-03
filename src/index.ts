import * as PIXI from 'pixi.js';
import { Game } from './core/Game';

window.PIXI = PIXI;

(async () => {
  const game = new Game();
  await game.start();
})();
