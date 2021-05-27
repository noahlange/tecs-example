import type * as generators from '@core/maps/generators';
import type { GameTileData } from '@core/maps/lib/GameMap';
import type { Color, Prefab, Vector2 } from '@lib/types';

import { RNG } from '@utils';
import { setID } from 'tecs';

export interface GeneratorPayload {
  x: number;
  y: number;
  width: number;
  height: number;
  seed: string;
  builder: keyof typeof generators;
}

export interface GeneratorResponse {
  tiles: [Vector2, GameTileData][];
  lights: [Vector2, Color][];
  prefabs: Prefab[];
  tints: [Vector2, Color][];
}

self.onmessage = async (e: MessageEvent<GeneratorPayload>) => {
  setID(RNG.id);
  RNG.setSeed('start');
  const { work } = await import('./worker');
  // @ts-ignore
  postMessage(await work(e.data));
};

export default {};
