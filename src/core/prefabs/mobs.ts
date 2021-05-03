import type { Prefab } from '../../lib/types';

import { Monster, Player } from '@core/entities';
import { HealthBar } from '@lib';
import { AIType, Faction } from '@lib/enums';
import { T } from '@utils';

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
  tags: [],
  data: {
    text: { title: 'Player' },
    light: { color: { r: 0, g: 0, b: 255, a: 1 } },
    sprite: { key: 'players.player_01' },
    view: { range: 10 },
    position: { z: 10 }
  }
};
