import type { Prefab } from '@lib/types';

import { AOE, DamageType } from '@lib/enums';

import { Attack } from '../entities';

export const attacks: Prefab[] = [
  {
    id: 'attack01',
    entity: Attack,
    tags: [],
    data: {
      aoe: { range: 3, type: AOE.CIRCLE },
      equip: {
        damage: [{ type: DamageType.ENERGY, value: '2d6' }]
      }
    }
  }
];
