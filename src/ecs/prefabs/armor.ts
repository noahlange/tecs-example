import { Equipment } from '@ecs/entities';
import { EquipSlot, ItemType, Tag } from '@enums';
import type { Prefab } from '@types';

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
