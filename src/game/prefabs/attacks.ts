import type { Prefab } from '@lib/types';

import { Attack } from '@core/entities';
import { DamageType } from '@game/enums';
import { AOE } from '@lib/enums';

export const attacks: Prefab[] = [
  {
    id: 'attack01',
    entity: Attack,
    tags: [],
    data: {
      aoe: { range: 1, type: AOE.LINE },
      equip: {
        damage: [{ type: DamageType.SHARP, value: '2d6' }]
      }
    }
  }
];
