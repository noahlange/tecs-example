import potions from './potions.json';
import walls from './walls.json';
import sprites from './sprites.json';
import players from './players.json';
import undead from './undead.json';
import doors from './doors.json';
import floors from './floors.json';
import scrolls from './scrolls.json';
import weapons from './weapons.json';
import decor from './decor.json';
import books from './books.json';
import chests from './chests.json';
import gui from './gui.json';

import spritesURL from 'url:../sprites/sprites.png';
import wallsURL from 'url:../sprites/walls.png';
import potionsURL from 'url:../sprites/potions.png';
import playersURL from 'url:../sprites/players.png';
import undeadURL from 'url:../sprites/undead.png';
import doorsURL from 'url:../sprites/doors.png';
import floorsURL from 'url:../sprites/floors.png';
import scrollsURL from 'url:../sprites/scrolls.png';
import weaponsURL from 'url:../sprites/weapons.png';
import decorURL from 'url:../sprites/decor.png';
import booksURL from 'url:../sprites/books.png';
import chestsURL from 'url:../sprites/chests.png';
import guiURL from 'url:../sprites/gui.png';

export const atlas: Record<string, { image: string; atlas: any }> = {
  potions: { image: potionsURL, atlas: potions },
  sprites: { image: spritesURL, atlas: sprites },
  walls: { image: wallsURL, atlas: walls },
  players: { image: playersURL, atlas: players },
  undead: { image: undeadURL, atlas: undead },
  doors: { image: doorsURL, atlas: doors },
  floors: { image: floorsURL, atlas: floors },
  scrolls: { image: scrollsURL, atlas: scrolls },
  weapons: { image: weaponsURL, atlas: weapons },
  decor: { image: decorURL, atlas: decor },
  books: { image: booksURL, atlas: books },
  chests: { image: chestsURL, atlas: chests },
  gui: { image: guiURL, atlas: gui }
};
