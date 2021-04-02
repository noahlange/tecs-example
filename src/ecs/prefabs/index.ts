import { attacks } from './attacks';
import { items } from './items';
import { armor } from './armor';
import { weapons } from './weapons';
import { enemies, player } from './mobs';
import { consumables } from './consumables';

export default [
  ...attacks,
  ...items,
  ...armor,
  ...weapons,
  ...enemies,
  ...consumables
];

export { attacks, armor, weapons, enemies, player, items, consumables };
