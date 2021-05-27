import type { LightingPayload, LightingResponse } from './index';

import { Lighting, Vector2Array } from '@lib';
import { CHUNK_HEIGHT, CHUNK_RADIUS, CHUNK_WIDTH, isObstruction } from '@utils';
import { FOV } from 'malwoden';

export function work(data: LightingPayload): LightingResponse {
  const width = (CHUNK_RADIUS * 2 + 1) * CHUNK_WIDTH;
  const height = (CHUNK_RADIUS * 2 + 1) * CHUNK_HEIGHT;

  const tiles = Vector2Array.from(data.tiles);
  const lights = Vector2Array.from(data.lights);

  const fov = new FOV.PreciseShadowcasting({
    topology: 'four',
    returnAll: true,
    lightPasses: point => !isObstruction(tiles.get(point)?.collision)
  });

  const lighting = new Lighting({ width, height, fov }, point =>
    isObstruction(tiles.get(point)?.collision) ? 0 : 0.3
  );

  for (const [point, color] of lights.entries()) {
    lighting.setLight(point, color);
  }

  return {
    tints: Array.from(lighting.compute())
  };
}
