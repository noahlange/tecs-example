import type { Prefab } from '@lib/types';

import { Monster, Player } from '@core/entities';
import { HealthBar } from '@lib';
import { AIType, Direction, Faction, Tag } from '@lib/enums';
import { T } from '@utils';

import atlas from '../../../static/sprites/Medieval_PB_Premade_Male_3_Mastersheet.json';

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

export const player: Prefab<typeof Player> = {
  id: 'player01',
  entity: Player,
  tags: [Tag.IS_ANIMATING],
  data: {
    position: { x: 8, y: 8, d: Direction.N, z: 100 },
    animation: {
      fps: 9,
      atlas,
      animation: 'idle',
      index: null,
      reset: null
    },
    sprite: {
      pivot: { x: 0.5, y: 0.5 }
    }
  }
};