import type { Color, Prefab, Vector2 } from '../lib/types';
import type { GameTileData } from '@core/maps/lib/GameMap';

import * as generators from '@core/maps/generators';
import * as prefabbed from '@core/prefabs';
import { isObstruction, RGB, RNG } from '@utils';
import { fromChunkPosition } from '@utils/geometry';

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
}

self.onmessage = async (e: MessageEvent<GeneratorPayload>) => {
  const { builder, seed, x, y, ...options } = e.data;

  RNG.setSeed(seed);
  const Generator = generators[builder];
  const gen = new Generator(options);
  gen.generate();

  // compute lights
  const tiles = gen.history[gen.history.length - 1];

  // add lights
  const lights = Array.from(tiles.entries())
    .filter(([, tile]) => RNG.float() < 0.075 && !isObstruction(tile.collision))
    .map(([point]) => [
      point,
      RGB.simplify({
        r: RNG.int.between(25, 75),
        g: RNG.int.between(25, 75),
        b: RNG.int.between(25, 75),
        a: 1
      })
    ]);

  // @todo - generate tracker ID for prefabs so we don't recreate existing entities
  const shuffled: Prefab[] = RNG.shuffle([
    ...prefabbed.weapons,
    ...prefabbed.items,
    ...prefabbed.consumables
  ]);

  const prefabs = shuffled
    .slice(0, 5)
    .filter(prefab => !!prefab)
    .map(prefab => {
      return {
        id: prefab.id,
        data: Object.assign(prefab.data, {
          position: fromChunkPosition({ x, y }, gen.getSpawn())
        }),
        tags: prefab.tags
      };
    });

  // @ts-ignore
  postMessage({ tiles: Array.from(tiles.entries()), lights, prefabs });
};

export default {};
