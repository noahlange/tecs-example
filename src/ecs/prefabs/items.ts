import { Book, Scroll } from '@ecs/entities';
import { ItemType, Tag } from '@enums';
import type { Prefab } from '@types';

export const items: Prefab[] = [
  {
    entity: Book,
    tags: [],
    data: {
      text: { title: 'Book', value: 'This is a book.' },
      item: {
        type: ItemType.MISC,
        description: 'This will make you super-smart.'
      },
      sprite: { key: 'book_01', tint: { r: 255, g: 255, b: 255, a: 1 } }
    }
  },
  {
    entity: Scroll,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Scroll of Fireball' },
      item: {
        type: ItemType.MAGIC,
        description: 'FIIIIREEEBAAAAALLLLLLL!'
      },
      sprite: { key: 'scroll_03' }
    }
  }
];
