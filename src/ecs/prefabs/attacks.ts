import { Attack } from '@ecs/entities';
import { AOE, DamageType } from '@enums';
import type { Prefab } from '@types';

export const attacks: Prefab[] = [
  {
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
