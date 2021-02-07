export { T } from './utils/tiles';

export interface Point {
  x: number;
  y: number;
}

export type RGBColor = [number, number, number];

export enum Direction {
  N = 0,
  NE = 1,
  E = 2,
  SE = 3,
  S = 4,
  SW = 5,
  W = 6,
  NW = 7
}

export enum ID {
  NONE = 'none',
  INTERACT = 'interact',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  MOVE_UP = 'move_up',
  MOVE_DOWN = 'move_down',
  DIALOGUE_START = 'dialogue_start',
  DIALOGUE_NEXT = 'dialogue_next',
  DIALOGUE_CHOOSE = 'dialogue_choose'
}

export interface UITextMessage {
  text: string;
  title: string;
}

export enum UIMode {
  DEFAULT = 'DEFAULT',
  DIALOGUE = 'DIALOGUE',
  MENU = 'MENU'
}
