import { AIType, Faction } from '@types';
import { T } from '@utils';

export const enemies = [
  {
    entity: 'Monster',
    tags: [],
    data: {
      text: { title: 'Skeleton' },
      stats: { hp: 25, hpMax: 25 },
      sprite: { key: 'undead_17' },
      ai: { type: AIType.FRENZIED, factions: [Faction.MONSTER] }
    }
  },
  {
    entity: 'Monster',
    tags: [],
    data: {
      text: { title: 'Orc' },
      stats: { hp: 50, hpMax: 50 },
      sprite: { key: T.ORC, tint: [100, 100, 100] },
      ai: { type: AIType.AGGRESSIVE, factions: [Faction.MONSTER] }
    }
  }
];
