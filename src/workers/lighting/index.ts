import type { GameTileData } from '@core/maps/lib/GameMap';
import type { Color, Vector2 } from '@lib/types';

import { RNG } from '@utils';
import { setID } from 'tecs';

export interface LightingPayload {
  tiles: [Vector2, GameTileData][];
  lights: [Vector2, Color][];
}

export interface LightingResponse {
  tints: [Vector2, Color][];
}

self.onmessage = async (e: MessageEvent<LightingPayload>) => {
  setID(RNG.id);
  RNG.setSeed('start');
  const { work } = await import('./worker');
  // @ts-ignore
  postMessage(await work(e.data));
};

export default {};
