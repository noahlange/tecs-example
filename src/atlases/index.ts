import books from './books.json';
import chests from './chests.json';
import decor from './decor.json';
import doors from './doors.json';
import floors from './floors.json';
import gui from './gui.json';
import players from './players.json';
import potions from './potions.json';
import scrolls from './scrolls.json';
import sprites from './sprites.json';
import undead from './undead.json';
import walls from './walls.json';
import weapons from './weapons.json';

export const atlas: Record<string, { image: string; atlas: any }> = {
  potions: { image: '/static/sprites/potions.png', atlas: potions },
  sprites: { image: '/static/sprites/sprites.png', atlas: sprites },
  walls: { image: '/static/sprites/walls.png', atlas: walls },
  players: { image: '/static/sprites/players.png', atlas: players },
  undead: { image: '/static/sprites/undead.png', atlas: undead },
  doors: { image: '/static/sprites/doors.png', atlas: doors },
  floors: { image: '/static/sprites/floors.png', atlas: floors },
  scrolls: { image: '/static/sprites/scrolls.png', atlas: scrolls },
  weapons: { image: '/static/sprites/weapons.png', atlas: weapons },
  decor: { image: '/static/sprites/decor.png', atlas: decor },
  books: { image: '/static/sprites/books.png', atlas: books },
  chests: { image: '/static/sprites/chests.png', atlas: chests },
  gui: { image: '/static/sprites/gui.png', atlas: gui }
};
