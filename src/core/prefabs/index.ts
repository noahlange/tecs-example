import { armor } from './armor';
import { attacks } from './attacks';
import { consumables } from './consumables';
import { items } from './items';
import { enemies, player } from './mobs';
import { weapons } from './weapons';

export default [
  ...attacks,
  ...items,
  ...armor,
  ...weapons,
  ...enemies,
  ...consumables
];

export { attacks, armor, weapons, enemies, player, items, consumables };
