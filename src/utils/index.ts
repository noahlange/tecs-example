import type { Color, Size } from '../lib/types';

// @todo - dynamic on a per-map basis?
export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;
export const CHUNK_RADIUS = 1;

export const RESOLUTION = 1;

export const AMBIENT_LIGHT: Color = { r: 80, g: 80, b: 80, a: 1 };
export const AMBIENT_DARK: Color = { r: 40, g: 40, b: 40, a: 1 };

export const view: Size = { width: 1920 / 2, height: 1080 / 2 };

export const bit = {
  any(target: number, toMatch: number = 0): boolean {
    return !target || (target & toMatch) > 0;
  },
  all(target: number, toMatch: number = 0): boolean {
    return (target & toMatch) === target;
  },
  none(target: number, toMatch: number = 0): boolean {
    return !toMatch || !(toMatch & target);
  }
};

export { T } from './tiles';
export { roll } from './random';
export { work } from './worker';

// namespace exports
export * as RNG from './random';
export * as RGB from './colors';
export * as _ from './misc';

// universal exports
export * from './actions';
export * from './decorators';
export * from './dialogue';
export * from './collisions';
