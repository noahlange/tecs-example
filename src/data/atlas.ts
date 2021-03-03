import potions from './atlases/potions.json';
import walls from './atlases/walls.json';
import sprites from './atlases/sprites.json';
import players from './atlases/players.json';
import undead from './atlases/undead.json';
import doors from './atlases/doors.json';
import floors from './atlases/floors.json';
import scrolls from './atlases/scrolls.json';
import weapons from './atlases/weapons.json';
import decor from './atlases/decor.json';
import books from './atlases/books.json';
import chests from './atlases/chests.json';
import gui from './atlases/gui.json';

import spritesURL from 'url:../assets/sprites/sprites.png';
import wallsURL from 'url:../assets/sprites/walls.png';
import potionsURL from 'url:../assets/sprites/potions.png';
import playersURL from 'url:../assets/sprites/players.png';
import undeadURL from 'url:../assets/sprites/undead.png';
import doorsURL from 'url:../assets/sprites/doors.png';
import floorsURL from 'url:../assets/sprites/floors.png';
import scrollsURL from 'url:../assets/sprites/scrolls.png';
import weaponsURL from 'url:../assets/sprites/weapons.png';
import decorURL from 'url:../assets/sprites/decor.png';
import booksURL from 'url:../assets/sprites/books.png';
import chestsURL from 'url:../assets/sprites/chests.png';
import guiURL from 'url:../assets/sprites/gui.png';

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
