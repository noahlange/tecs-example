import type { DataType } from 'tecs';
import type { Point } from '../types';

import * as ROT from 'rot-js';
import type { Item } from '.';

export const items: DataType<typeof Item>[] = [
  {
    glyph: { text: 'B', fg: [255, 255, 255] },
    collision: { passable: true, allowLOS: true },
    description: { name: 'Book', text: 'This is a book.' }
  }
];

export function getItem(bounds: [Point, Point]): DataType<typeof Item> {
  const [nw, se] = bounds;
  const x = ROT.RNG.getUniformInt(nw.x, se.x);
  const y = ROT.RNG.getUniformInt(nw.y, se.y);
  const res = ROT.RNG.getItem(items);
  return Object.assign({ position: { x, y } }, res);
}
