import { AOE, DamageType } from '@utils/enums';

export const attacks = [
  {
    aoe: { range: 3, type: AOE.CIRCLE },
    equip: {
      damage: [{ type: DamageType.ENERGY, value: '2d6' }]
    }
  }
];
