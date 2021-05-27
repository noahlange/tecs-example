import type { Prefab } from '@lib/types';

import { Equipment } from '@core/entities';
import { EquipSlot, ItemType, Tag } from '@lib/enums';

export const armor: Prefab[] = [
  {
    id: 'armor01',
    entity: Equipment,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Robes & Wizard Hat' },
      equip: {
        slot: EquipSlot.ARMOR_TORSO,
        sprite: 'player_02',
        damage: []
      },
      item: {
        id: 'armor01',
        type: ItemType.ARMOR,
        description: '"I put on my robe and wizard hat."'
      },
      sprite: {}
    }
  }
];
