import { Potion } from '@ecs/entities';
import { EffectType, ItemType, Tag } from '@enums';
import type { Prefab } from '@types';

export const items: Prefab[] = [
  {
    entity: Potion,
    tags: [Tag.IS_CONSUMABLE],
    data: {
      text: { title: 'Potion of Minor Health' },
      item: {
        type: ItemType.CONSUMABLE,
        description: "This is a health potion. It's super great."
      },
      sprite: { key: 'potion_01' },
      effects: {
        effects: [
          { type: EffectType.HP_ADD, value: 10, description: '', duration: 1 }
        ]
      }
    }
  },
  {
    entity: Potion,
    tags: [Tag.IS_CONSUMABLE],
    data: {
      text: { title: 'Potion of Fortify Health' },
      item: {
        type: ItemType.CONSUMABLE,
        description: 'This is a health potion. It will make you big and stronk.'
      },
      sprite: { key: 'potion_08' },
      effects: {
        effects: [
          { type: EffectType.HP_MAX, value: 10, description: '', duration: 1 }
        ]
      }
    }
  }
];
