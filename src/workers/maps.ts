import { TileType } from '@enums';
import { Lighting } from '@lib';
import type { Vector2, Color } from '@types';
import { CHUNK_HEIGHT, CHUNK_WIDTH } from '@utils';

import * as RNG from '@utils/random';
import { FOV } from 'malwoden';

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
  tints: [Vector2, Color][];
}

self.onmessage = async (e: MessageEvent<GeneratorPayload>) => {
  const generators = await import('../maps/generators');
  const { builder, x, y, ...options } = e.data;

  RNG.setSeed(`${x},${y}`);
  const Generator = generators[builder];
  const gen = new Generator(options);
  gen.generate();

  // compute lights
  const tiles = gen.history[gen.history.length - 1];
  const fov = new FOV.PreciseShadowcasting({
    lightPasses: point => tiles.is(point, TileType.FLOOR),
    returnAll: true,
    topology: 'four'
  });

  const lighting = new Lighting(
    { width: CHUNK_WIDTH, height: CHUNK_HEIGHT, fov, range: 8, passes: 1 },
    point => (tiles.is(point, TileType.WALL) ? 0 : 0.3)
  );

  // add lights
  for (const [point, tile] of tiles.entries()) {
    if (RNG.float() < 0.0625 && tile === TileType.FLOOR) {
      // without a proper cross-chunk lighting implementation, we'll have to manually avoid light spill-over.
      if (point.x > 3 && point.x < CHUNK_WIDTH - 3) {
        if (point.y > 3 && point.y < CHUNK_HEIGHT - 3) {
          const val = RNG.getUniformInt(50, 125);
          lighting.setLight(point, { r: val, g: val, b: 0, a: 1 });
        }
      }
    }
  }

  // @ts-ignore
  postMessage({
    tiles: Array.from(tiles.entries()),
    tints: Array.from(lighting.compute())
  });
};
