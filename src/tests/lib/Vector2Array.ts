import { describe, expect, test } from '@jest/globals';
import { Vector2Array } from '@lib';

describe('Vector2Array.getIndex()', () => {
  test('should return index corresponding to point', () => {
    const width = 5;
    const height = 3;

    const arr = new Vector2Array({ width, height });

    // @ts-expect-error
    expect(arr.getIndex({ x: 1, y: 2 })).toEqual(height + 2);
  });
});

describe('Vector2Array.getPoint()', () => {
  test('should return point corresponding to index', () => {
    const [width, height] = [96, 48];
    const arr = new Vector2Array<number>({ width, height });
    const pt = { x: 16, y: 8 };
    // @ts-expect-error
    const i = arr.getIndex(pt);
    // @ts-expect-error
    expect(arr.getPoint(i)).toEqual(pt);
  });
});
