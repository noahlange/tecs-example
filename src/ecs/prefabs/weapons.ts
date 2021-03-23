import { DamageType, EquipSlot, ItemType, Tag } from '@enums';
import { Equipment } from '@ecs/entities';
import type { Prefab } from '@types';

export const weapons: Prefab[] = [
  {
    entity: Equipment,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Sword' },
      equip: {
        slot: EquipSlot.WEAPON_MAIN,
        damage: [{ value: '3d4', type: DamageType.SHARP }]
      },
      item: {
        type: ItemType.WEAPON,
        description: 'A sword.'
      },
      sprite: { key: 'weapon_21' }
    }
  },
  {
    entity: Equipment,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Mace' },
      equip: {
        slot: EquipSlot.WEAPON_MAIN,
        damage: [{ value: '3d4', type: DamageType.BLUNT }]
      },
      item: {
        type: ItemType.WEAPON,
        description:
          'A mace. Great for inflicting blunt-force trauma; less effective if used as an aerosolized pepper spray.'
      },
      sprite: { key: 'weapon_25' }
    }
  }
];
