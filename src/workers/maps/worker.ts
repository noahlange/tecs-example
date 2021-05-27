import type { GeneratorPayload, GeneratorResponse } from './';
import type { Color, Prefab, Vector2 } from '@lib/types';
import type { EntityClass } from 'tecs';

import * as generators from '@core/maps/generators';
import * as prefabbed from '@core/prefabs';
import { Lighting } from '@lib';
import { isObstruction, RGB, RNG } from '@utils';
import { FOV } from 'malwoden';

export function work(data: GeneratorPayload): GeneratorResponse {
  const { builder, seed, ...options } = data;

  RNG.setSeed(seed);
  const Generator = generators[builder];
  const gen = new Generator(options);
  gen.generate();

  // compute lights
  const tiles = gen.history[gen.history.length - 1];

  // add lights
  const lights: [Vector2, Color][] = Array.from(tiles.entries())
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

  const prefabs: Prefab[] = shuffled
    .slice(0, 3)
    .filter(prefab => !!prefab)
    .map(prefab => {
      const point = gen.getSpawn();
      if (point) {
        return {
          id: RNG.id(),
          entity: { id: prefab.entity.id } as EntityClass,
          tags: prefab.tags,
          data: Object.assign(prefab.data, {
            position: { ...point, z: 5 }
          })
        };
      } else {
        return null;
      }
    })
    .filter(f => !!f) as Prefab[];

  const fov = new FOV.PreciseShadowcasting({
    topology: 'four',
    returnAll: true,
    lightPasses: point => !isObstruction(tiles.get(point)?.collision)
  });

  const lighting = new Lighting({ ...options, fov }, point =>
    isObstruction(tiles.get(point)?.collision) ? 0 : 0.3
  );

  for (const [point, color] of lights) {
    lighting.setLight(point, color);
  }

  return {
    tiles: Array.from(tiles.entries()),
    lights,
    prefabs,
    tints: []
    // tints: Array.from(lighting.compute())
  };
}
