import { describe, expect, test } from '@jest/globals';
import { getNeighbors, iterateGrid } from '@utils/geometry';

describe('iterateGrid()', () => {
  describe('should iterate through x/y coordinates...', () => {
    test('...given a size', () => {
      const [width, height] = [5, 5];
      const points = iterateGrid({ width, height });
      expect(Array.from(points)).toHaveLength(width * height);
    });

    test('...within bounds (2 points)', () => {
      const points = iterateGrid({ x: 0, y: 0 }, { x: 2, y: 2 });
      expect(Array.from(points)).toHaveLength(4);
    });

    test('...within bounds (rectangle)', () => {
      const points = iterateGrid({ x1: 0, y1: 0, x2: 2, y2: 2 });
      expect(Array.from(points)).toHaveLength(4);
    });

    test('...should return the same points for the same values', () => {
      const [x, y, w, h] = [0, 0, 2, 2];
      const points = Array.from(iterateGrid({ x: x, y: y }, { x: w, y: h }));
      const bounds = Array.from(iterateGrid({ x1: x, y1: y, x2: w, y2: h }));
      const dimensions = Array.from(iterateGrid({ width: h, height: h }));
      expect(points).toEqual(dimensions);
      expect(points).toEqual(bounds);
      expect(bounds).toEqual(dimensions);
    });
  });
});

describe('getNeighbors()', () => {
  describe('return neighboring points', () => {
    test('given a point', () => {
      const points = (() => {
        const res = [];
        for (let y = -1; y <= 1; y++) {
          for (let x = -1; x <= 1; x++) {
            if (x || y) {
              res.push({ x, y });
            }
          }
        }
        return res;
      })();

      expect(getNeighbors({ x: 0, y: 0 })).toEqual(points);
    });
    test('...within a given radius', () => {
      const points = (() => {
        const res = [];
        for (let y = -2; y <= 2; y++) {
          for (let x = -2; x <= 2; x++) {
            if (x || y) {
              res.push({ x, y });
            }
          }
        }
        return res;
      })();

      expect(getNeighbors({ x: 0, y: 0 }, 2)).toEqual(points);
    });

    test('...within bounds', () => {
      const bounds = { x1: -1, x2: 0, y1: -1, y2: 0 };
      const points = (() => {
        const res = [];
        for (let y = -1; y <= 0; y++) {
          for (let x = -1; x <= 0; x++) {
            if (x || y) {
              res.push({ x, y });
            }
          }
        }
        return res;
      })();

      expect(getNeighbors({ x: 0, y: 0 }, 1, bounds)).toEqual(points);
    });
  });
});
