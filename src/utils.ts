import type { Point, RGBColor } from './types';
import { Direction } from './types';

export const WIDTH = 48;
export const HEIGHT = 32;
export const AMBIENT_LIGHT: RGBColor = [40, 40, 40];
export const AMBIENT_DARK: RGBColor = [30, 30, 30];

export function toCoordString({ x, y }: Point): string {
  return x + ',' + y;
}

export function getInteractionPos(point: Point, d: Direction): Point {
  let { x, y } = point;
  switch (d) {
    case Direction.N:
    case Direction.NE:
    case Direction.NW:
      y -= 1;
      break;
    case Direction.S:
    case Direction.SE:
    case Direction.SW:
      y += 1;
      break;
  }
  switch (d) {
    case Direction.NW:
    case Direction.W:
    case Direction.SW:
      x -= 1;
      break;
    case Direction.NE:
    case Direction.E:
    case Direction.SE:
      x += 1;
      break;
  }
  return { x, y };
}

/**
 * Adapted from https://github.com/norbornen/execution-time-decorator, released
 * under the terms of the MIT License. Decorate methods to log execution time.
 */

export function timer(
  name: string,
  useGroups: boolean = true
): MethodDecorator {
  const times: number[] = [];
  return (
    target: any,
    propertyKey: string | symbol,
    propertyDescriptor: PropertyDescriptor
  ): any => {
    propertyDescriptor ??= Object.getOwnPropertyDescriptor(
      target,
      propertyKey
    )!;

    const close = (start: number): void => {
      const diff = (performance.now() - start).toFixed(2);
      times.push(+diff);
      // first tick severely skews the average
      const avg = times.slice(1).reduce((a, b) => a + b, 0) / times.length;
      const timeText = avg
        ? `${diff}ms (avg. ${avg.toFixed(2)}ms)`
        : `${diff}ms`;

      console.log(useGroups ? timeText : [name, timeText].join(': '));
      if (useGroups) {
        console.groupEnd();
      }
    };

    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = function (...args: any[]) {
      if (useGroups) {
        console.group(name);
      }
      const start = performance.now();
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result
          .catch(e => e)
          .then(res => {
            close(start);
            return res;
          });
      } else {
        close(start);
        return result;
      }
    };

    return propertyDescriptor;
  };
}

// https://opengameart.org/content/8x8-1bit-roguelike-tiles-bitmap-font
export const glyphs = `data:image/png;base64,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`;
