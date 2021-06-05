import '@ui/styles/index.scss';

import { Components, Entities } from '@core';
import { RNG } from '@utils';
import * as PIXI from 'pixi.js';
import { setID } from 'tecs';

import * as C from './components';
import * as E from './entities';

// required for PIXI dev tools
window.PIXI = PIXI;
// @ts-ignore: can't blacklist nodejs in @types
window.global = window.globalThis;

setID(RNG.id);

(async () => {
  RNG.setSeed('start');

  const { Game } = await import('../core/Game');
  const { Gameplay, MapGen } = await import('./scenes');

  /**
   * @todo
   * const json = JSON.parse(
   *   window.localStorage.getItem('tecs:save') ?? '{ "ecs": null }'
   * );
   */

  const game = new Game();
  game.ctx.register(
    ...Object.values({ ...Entities, ...Components, ...E, ...C })
  );

  await game.start();

  game.$.scenes.push(MapGen);
  game.$.scenes.push(Gameplay);
})();
