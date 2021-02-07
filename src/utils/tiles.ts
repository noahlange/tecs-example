import type { Point } from '../types';
import { tileAt } from '.';

export enum T {
  SPACE = ' ',
  ASTERISK = '*',
  AT = '@',
  EXCLAMATION = '!',
  DOUBLE_QUOTE = '"',
  SINGLE_QUOTE = "'",
  PLUS = '+',
  HASH = '#',
  DOLLAR = '$',
  PERCENT = '%',
  AMPERSAND = '&',
  PAREN_LEFT = '(',
  PAREN_RIGHT = ')',
  CHEST = '\uE000',
  CHEST_OPEN = '\uE001',
  DOOR = '\uE002',
  DOOR_OPEN = '\uE003',
  WALL = '\uE004',
  BLANK = '\uE005'
}

const tiles: Record<string, Point> = {
  // symbols
  [T.AT]: { x: 0, y: 4 },
  [T.EXCLAMATION]: { x: 1, y: 2 },
  [T.DOUBLE_QUOTE]: { x: 2, y: 2 },
  [T.SINGLE_QUOTE]: { x: 7, y: 2 },
  [T.HASH]: { x: 3, y: 2 },
  [T.DOLLAR]: { x: 4, y: 2 },
  [T.PERCENT]: { x: 5, y: 2 },
  [T.AMPERSAND]: { x: 6, y: 2 },
  [T.PAREN_LEFT]: { x: 8, y: 2 },
  [T.PAREN_RIGHT]: { x: 9, y: 2 },
  [T.ASTERISK]: { x: 10, y: 2 },
  [T.PLUS]: { x: 11, y: 2 },
  ',': { x: 12, y: 2 },
  '-': { x: 13, y: 2 },
  '.': { x: 14, y: 2 },
  '/': { x: 15, y: 2 },
  // numbers
  '0': { x: 0, y: 3 },
  '1': { x: 1, y: 3 },
  '2': { x: 2, y: 3 },
  '3': { x: 3, y: 3 },
  '4': { x: 4, y: 3 },
  '5': { x: 5, y: 3 },
  '6': { x: 6, y: 3 },
  '7': { x: 7, y: 3 },
  '8': { x: 8, y: 3 },
  '9': { x: 9, y: 3 },
  // punctuation
  '`': { x: 0, y: 6 },
  ':': { x: 10, y: 3 },
  ';': { x: 11, y: 3 },
  '<': { x: 12, y: 3 },
  '=': { x: 13, y: 3 },
  '>': { x: 14, y: 3 },
  '?': { x: 15, y: 3 },
  '[': { x: 11, y: 5 },
  '\\': { x: 12, y: 5 },
  ']': { x: 13, y: 5 },
  '^': { x: 14, y: 5 },
  _: { x: 15, y: 5 },
  // letters - caps
  A: { x: 1, y: 4 },
  B: { x: 2, y: 4 },
  C: { x: 3, y: 4 },
  D: { x: 4, y: 4 },
  E: { x: 5, y: 4 },
  F: { x: 6, y: 4 },
  G: { x: 7, y: 4 },
  H: { x: 8, y: 4 },
  I: { x: 9, y: 4 },
  J: { x: 10, y: 4 },
  K: { x: 11, y: 4 },
  L: { x: 12, y: 4 },
  M: { x: 13, y: 4 },
  N: { x: 14, y: 4 },
  O: { x: 15, y: 4 },
  P: { x: 0, y: 5 },
  Q: { x: 1, y: 5 },
  R: { x: 2, y: 5 },
  S: { x: 3, y: 5 },
  T: { x: 4, y: 5 },
  U: { x: 5, y: 5 },
  V: { x: 6, y: 5 },
  W: { x: 7, y: 5 },
  X: { x: 8, y: 5 },
  Y: { x: 9, y: 5 },
  Z: { x: 10, y: 5 },
  // letters - caps
  a: { x: 1, y: 6 },
  b: { x: 2, y: 6 },
  c: { x: 3, y: 6 },
  d: { x: 6, y: 6 },
  e: { x: 5, y: 6 },
  f: { x: 6, y: 6 },
  g: { x: 7, y: 6 },
  h: { x: 8, y: 6 },
  i: { x: 9, y: 6 },
  j: { x: 10, y: 6 },
  k: { x: 11, y: 6 },
  l: { x: 12, y: 6 },
  m: { x: 13, y: 6 },
  n: { x: 14, y: 6 },
  o: { x: 15, y: 6 },
  p: { x: 0, y: 7 },
  q: { x: 1, y: 7 },
  r: { x: 2, y: 7 },
  s: { x: 3, y: 7 },
  t: { x: 4, y: 7 },
  u: { x: 5, y: 7 },
  v: { x: 6, y: 7 },
  w: { x: 7, y: 7 },
  x: { x: 8, y: 7 },
  y: { x: 9, y: 7 },
  z: { x: 10, y: 7 },
  '{': { x: 11, y: 7 },
  '|': { x: 12, y: 7 },
  '}': { x: 13, y: 7 },
  '~': { x: 14, y: 7 },
  [T.CHEST]: { x: 8, y: 13 },
  [T.CHEST_OPEN]: { x: 9, y: 13 },
  [T.DOOR]: { x: 3, y: 13 },
  [T.DOOR_OPEN]: { x: 2, y: 13 },
  [T.WALL]: { x: 12, y: 0 },
  [T.SPACE]: { x: 1, y: 0 },
  [T.BLANK]: { x: 14, y: 12 }
};

export const tileMap = Object.entries(tiles).reduce(
  (a: Record<string, [number, number]>, [key, value]) => {
    return { ...a, [key]: tileAt(value) };
  },
  {}
);

export const tileAtlas = Object.entries(tiles).reduce(
  (a, [key, value]) => {
    const [x, y] = tileAt(value);
    return {
      frames: { ...a.frames, [key]: { frame: { x, y, w: 8, h: 8 } } },
      meta: a.meta
    };
  },
  { frames: {}, meta: { scale: '1' } }
);

// https://opengameart.org/content/8x8-1bit-roguelike-tiles-bitmap-font
export const glyphs = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURUdwTP///5+UokMAAAABdFJOUwBA5thmAAAE2UlEQVRIx22W0WscdRDHp02zrrpcrzXgKEsSj6UtIcI2F9YFx016HKVIHvqQvhxWFk9+KY2Eo8EmlPO3SREaxAcNvvgfyD3Wt0JBOKgv8V3si6BkH4TQB6Eppvdz5rcbe6n5kSy7n8x8Z3Z+85sNAK8zvXoP+mYPykXNa/We2Xy+91QD8jPqM72dHqDpPb0DxM+km9d2eoZvn34M2gKrQWaNH7V1sRr4fC3riguLWo1Ncy1bsaIAVqMPkMmDKULvIJZJ/DIjV29LjCfl9scF92S1emqLWK5auFxpbi/yjQbfL8DU4uJiqjRhbbzQqI0txueabOFGhQb7Vk82jUG3NhQWkOP6cOzCKHCB0Avt00kBOvlUsUcguToMzgY3rpAbejZ5jwEESfUtCD0t1UAB+vUggdLCKgXJggLRqAKmYgEufAASZRLwmDQIiSrJuJbXdyAlULFS4zOhozgVD0IFCj0nCrsWIKEDK/wHRcqjRGJ6PtzG0FlyFCpJmjgXhZ+oTIBnNTgKaXKIYorR5Sh4XB6aulmW5DS32mkvcR5Uvx1dvLjK4aNw7TbnoeppPQxTBhRmDFZ0ktaJUo1eHC5rBoXFkrVoryhIlWiEVuOiAMolyvpcTvFq1t6l/+eh6WB8Ls/zfq79+ZgTrSs1866SdRlTJAtCT6kGVwBDVACJ6vqeClqYIBYboZTDFWqRF6JnwYo652kkrgs6AiSDccKg39E+xLa1X1pVSHk/KvA7YicW4FqAfIWwqB91KeGydeO4josfyf5JlnqH9ynCm8pmxl2LXSX7ZoEYpLx7LyxEg9Zz6qzSXzkd36pFiwK/7lHAb8unSSdRsr6m2pHqVtHVUqD30zBSy75a4PdfkDRCHUbBspsgW4h/EjphRMu+M1NUbP2V9a7vYxSRLqNId2MZBIcA4RDw49QpAYLB008m9rMBotmfMDxFDE7sn34yBAB9LmXqlB5YnE8omhaLmfQysEXjsLYD5GSruYOl3WygVb67lEsUlQ3aj4xRqv+o3Tf8/qpTSZ2fRtjcSQuB1OlUhoBR7UfZoHQxfc1gaXfuIBsozaJGtqEIxodAbsqNK1YghzwAkxuT86/JZxnMzlrwx88CAjOxf/7PMo+Um2K6VgtqXpmHgGBr8ssLTXaxDuw5a977e2KfgZVkEEiM4bDTMD0tPVdUBy751CrOC2cDpEezRBdd3BqFFtxs3ZvKVHmi7smc0remplRhQbcCOKUvrPmHGo3PWxAljVuJ2yg68GGnAV9Mf3/l+vWHmxYEHwJs8HVszKYFMDICHRg5bFAet6Oj8DaMQtkYDF579ZQHjow13lSfwXdnTle4P4mnKAUJgxu1N9/4ofow4EWBWISXz79zdZIBDwrrcvXry5fSebIlB5fB1pONjW82hsKKOB2AOzTIWIy/C3B4lp5BQ5PGMd0owT/U0MEBHQF3qEqu1i9c7gTf0rAoawxoTKn/SKlxzOQovmJzZsA/PHfZIua9h0snTmTGNHg56rOzDObBglaj5dHeUfArDvwjLh3amzwiOqkG88d+1Vy04WNetl2oPM9NXjyguBMq2OEc3e37d+8+Pqs2gT+aRs5dj9f2DPb5HwJjNPnxg/vbD37TAiq6Q9qPxeCrkF1kvssBbnabzcdVFi3CVt3DsP8CPV/x40m4gNwAAAAASUVORK5CYII=`;
