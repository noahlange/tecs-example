import type { Vector2, Color } from '@types';

import { TileType } from '@enums';
import { CollisionMap, Lighting, Vector2Array } from '@lib';
import { CHUNK_HEIGHT, CHUNK_RADIUS, CHUNK_WIDTH } from '@utils';
import { FOV } from 'malwoden';

export interface LightingPayload {
  tiles: [Vector2, TileType][];
  lights: [Vector2, Color][];
}

export interface LightingResponse {
  tints: [Vector2, Color][];
}

self.onmessage = async (e: MessageEvent<LightingPayload>) => {
  const width = (CHUNK_RADIUS * 2 + 1) * CHUNK_WIDTH;
  const height = (CHUNK_RADIUS * 2 + 1) * CHUNK_HEIGHT;

  const lights = new Vector2Array<Color>({ width, height });
  const collisions = new CollisionMap({ width, height });

  for (const [point, tile] of e.data.tiles) {
    collisions.set(point, tile !== TileType.WALL);
  }

  for (const [point, light] of e.data.lights) {
    lights.set(point, light);
  }

  const fov = new FOV.PreciseShadowcasting({
    topology: 'four',
    returnAll: true,
    lightPasses: point => collisions.isVisible(point)
  });

  const lighting = new Lighting({ width, height, fov }, point =>
    collisions.isPassable(point) ? 0 : 0.3
  );

  for (const [point, color] of lights.entries()) {
    lighting.setLight(point, color);
  }

  // @ts-ignore
  postMessage({
    tints: Array.from(lighting.compute())
  });
};
