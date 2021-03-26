import type { TileType } from '@enums';
import type { Vector2 } from '@types';

import * as RNG from '@utils/random';

export interface GeneratorPayload {
  x: number;
  y: number;
  width: number;
  height: number;
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  builder: keyof typeof import('../maps/generators');
}

export interface GeneratorResponse {
  tiles: [Vector2, TileType][];
}

self.onmessage = async (e: MessageEvent<GeneratorPayload>) => {
  const generators = await import('../maps/generators');

  const { builder, x, y, ...options } = e.data;

  RNG.setSeed(`${x},${y}`);
  const Generator = generators[builder];
  const gen = new Generator(options);
  gen.generate();

  // @ts-ignore
  postMessage({
    tiles: Array.from(gen.history[gen.history.length - 1].entries())
  });
};
