import type { Prefab } from '@lib/types';

import { Monster, Player } from '@core/entities';
import { HealthBar } from '@lib';
import { AIType, Direction, Faction, Tag } from '@lib/enums';
import { jsonz, T } from '@utils';

export const enemies: Prefab[] = [
  {
    id: 'enemy01',
    entity: Monster,
    tags: [],
    data: {
      text: { title: 'Skeleton' },
      stats: { health: new HealthBar(25) },
      sprite: { key: 'undead.undead_17' },
      ai: { type: AIType.FRENZIED },
      faction: { factions: [Faction.MONSTER] }
    }
  },
  {
    id: 'enemy02',
    entity: Monster,
    tags: [],
    data: {
      text: { title: 'Orc' },
      stats: { health: new HealthBar(50) },
      sprite: { key: T.ORC, tint: { r: 100, g: 100, b: 100, a: 1 } },
      ai: { type: AIType.AGGRESSIVE },
      faction: { factions: [Faction.MONSTER] }
    }
  }
];

export async function getPlayerPrefab(): Promise<Prefab<typeof Player>> {
  return {
    id: 'player01',
    entity: Player,
    tags: [Tag.IS_ANIMATING],
    data: {
      position: { x: 24, y: 90, d: Direction.N, z: 100 },
      animation: {
        fps: 9,
        atlas: await jsonz.read('/static/sprites/characters/skeleton'),
        animation: 'idle',
        index: null,
        reset: null
      },
      sprite: {
        pivot: { x: 0.5, y: 0.5 }
      }
    }
  };
}
