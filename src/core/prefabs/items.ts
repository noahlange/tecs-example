import type { Prefab } from '@lib/types';

import { Book, Scroll } from '@core/entities';
import { ItemType, Tag } from '@lib/enums';

export const items: Prefab[] = [
  {
    id: 'book01',
    entity: Book,
    tags: [],
    data: {
      text: { title: 'Book', value: 'This is a book.' },
      item: {
        id: 'book01',
        type: ItemType.MISC,
        description: 'This will make you super-smart.'
      },
      sprite: { key: 'books.book_01', tint: { r: 255, g: 255, b: 255, a: 1 } }
    }
  },
  {
    id: 'book02',
    entity: Scroll,
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Scroll of Fireball' },
      item: {
        id: 'book02',
        type: ItemType.MAGIC,
        description: 'FIIIIREEEBAAAAALLLLLLL!'
      },
      sprite: { key: 'scrolls.scroll_03' }
    }
  }
];
