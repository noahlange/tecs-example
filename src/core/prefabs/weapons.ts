import type { Prefab } from '../../lib/types';

import { Equipment } from '@core/entities';
import { DamageType, EquipSlot, ItemType, Tag } from '@lib/enums';

export const weapons: Prefab[] = [
  {
    id: 'weapon01',
    entity: Equipment,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Sword' },
      equip: {
        slot: EquipSlot.WEAPON_MAIN,
        damage: [{ value: '3d4', type: DamageType.SHARP }]
      },
      item: {
        id: 'weapon01',
        type: ItemType.WEAPON,
        description: 'A sword.'
      },
      sprite: { key: 'weapons.weapon_21' }
    }
  },
  {
    id: 'weapon02',
    entity: Equipment,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Mace' },
      equip: {
        slot: EquipSlot.WEAPON_MAIN,
        damage: [{ value: '3d4', type: DamageType.BLUNT }]
      },
      item: {
        id: 'weapon02',
        type: ItemType.WEAPON,
        description:
          'A mace. Great for inflicting blunt-force trauma; less effective if used as an aerosolized pepper spray.'
      },
      sprite: { key: 'weapons.weapon_25' }
    }
  }
];
