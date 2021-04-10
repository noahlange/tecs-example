import type { Color, Size } from '@types';

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;
export const CHUNK_RADIUS = 1;

export const RESOLUTION = 3;

export const AMBIENT_LIGHT: Color = { r: 80, g: 80, b: 80, a: 1 };
export const AMBIENT_DARK: Color = { r: 30, g: 30, b: 30, a: 1 };
export const view: Size = { width: 1920 / 2, height: 1080 / 2 };
