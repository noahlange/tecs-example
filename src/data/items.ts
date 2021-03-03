import { EffectType, ItemType, Tag } from '@types';

export const items = [
  {
    entity: 'Potion',
    tags: [Tag.IS_CONSUMABLE],
    data: {
      text: { title: 'Potion of Minor Health' },
      item: {
        type: ItemType.CONSUMABLE,
        description: "This is a health potion. It's super great."
      },
      sprite: { key: 'potion_01' },
      effects: { effects: [{ type: EffectType.HP_ADD, value: 10 }] }
    }
  },
  {
    entity: 'Potion',
    tags: [Tag.IS_CONSUMABLE],
    data: {
      text: { title: 'Potion of Fortify Health' },
      item: {
        type: ItemType.CONSUMABLE,
        description: 'This is a health potion. It will make you big and stronk.'
      },
      sprite: { key: 'potion_08' },
      effects: { effects: [{ type: EffectType.HP_MAX, value: 10 }] }
    }
  },
  {
    entity: 'Book',
    tags: [],
    data: {
      text: { title: 'Book', value: 'This is a book.' },
      item: {
        type: ItemType.MISC,
        description: 'This will make you super-smart.'
      },
      sprite: { key: 'book_01', tint: [255, 255, 255] }
    }
  },
  {
    entity: 'Weapon',
    tags: [Tag.IS_EQUIPPABLE],
    data: {
      text: { title: 'Sword' },
      item: {
        type: ItemType.WEAPON,
        description: 'A sword.'
      },
      sprite: { key: 'weapon_21' }
    }
  },
  {
    entity: 'Scroll',
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
