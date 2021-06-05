import {
  Effects,
  Item,
  Position,
  Renderable,
  Sprite,
  Text
} from '@core/components';
import { Entity } from 'tecs';

import { Player } from './player';

const Book = Entity.with(Position, Sprite, Renderable, Text, Item, Effects);
const Potion = Entity.with(Position, Sprite, Renderable, Text, Item, Effects);
const Scroll = Entity.with(Position, Sprite, Renderable, Text, Item);

export { Book, Potion, Scroll, Player };

export type { PlayerEntity } from './player';
export { Monster } from './Monster';

export * from './types';
