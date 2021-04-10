import type { Vector2, Color, Prefab } from '@types';
import { TileType } from '@enums';
import { RNG, fromChunkPosition } from '@utils';

import * as generators from '../maps/generators';
import * as prefabbed from '../ecs/prefabs';

export interface GeneratorPayload {
  x: number;
  y: number;
  width: number;
  height: number;
  seed: string;
  builder: keyof typeof generators;
}

export interface GeneratorResponse {
  tiles: [Vector2, TileType][];
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
  const lights = [];
  for (const [point, tile] of tiles.entries()) {
    if (RNG.float() < 0.0625 && tile === TileType.FLOOR) {
      const val = RNG.int.between(25, 75);
      const val2 = RNG.int.between(25, 75);
      const val3 = RNG.int.between(25, 75);
      const color = { r: val, g: val2, b: val3, a: 1 };
      lights.push([point, color]);
    }
  }

  // generate tracker ID for prefabs so we don't recreate extant entities
  const prefabs: Prefab[] = [
    ...prefabbed.weapons,
    ...prefabbed.items,
    ...prefabbed.consumables
  ];

  const shuffled = RNG.shuffle(prefabs.slice());

  const res = [];
  for (let i = 0; i < 5; i++) {
    const prefab = shuffled.shift();
    if (prefab) {
      prefab.data = Object.assign(prefab.data, {
        position: fromChunkPosition({ x, y }, gen.getSpawn())
      });
      res.push(prefab);
    }
  }

  // @ts-ignore
  postMessage({
    tiles: Array.from(tiles.entries()),
    lights,
    prefabs: res.map(item => ({
      id: item.id,
      data: item.data,
      tags: item.tags
    }))
  });
};
