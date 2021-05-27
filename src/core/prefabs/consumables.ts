import type { Prefab } from '@lib/types';

import { Potion } from '@core/entities';
import { EffectType, ItemType, Tag } from '@lib/enums';

export const consumables: Prefab[] = [
  {
    id: 'item01',
    entity: Potion,
    tags: [Tag.IS_CONSUMABLE],
    data: {
      text: { title: 'Potion of Minor Health' },
      item: {
        id: 'item01',
        type: ItemType.CONSUMABLE,
        description: "This is a health potion. It's super great."
      },
      sprite: { key: 'potions.potion_01' },
      effects: {
        effects: [
          { type: EffectType.HP_ADD, value: 10, description: '', duration: 1 }
        ]
      }
    }
  },
  {
    id: 'item02',
    entity: Potion,
    tags: [Tag.IS_CONSUMABLE],
    data: {
      text: { title: 'Potion of Fortify Health' },
      item: {
        id: 'item02',
        type: ItemType.CONSUMABLE,
        description: 'This is a health potion. It will make you big and stronk.'
      },
      sprite: { key: 'potions.potion_08' },
      effects: {
        effects: [
          { type: EffectType.HP_MAX, value: 10, description: '', duration: 1 }
        ]
      }
    }
  }
];
