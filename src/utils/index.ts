import type { Point, RGBColor } from '../types';
import { Direction, ID } from '../types';

export const WIDTH = 60;
export const HEIGHT = 40;
export const TILE = 8;

export const AMBIENT_LIGHT: RGBColor = [80, 80, 80];
export const AMBIENT_DARK: RGBColor = [30, 30, 30];

export function tileAt({ x, y }: Point): [number, number] {
  return [x * TILE, y * TILE];
}

export function toCoordString({ x, y }: Point): string {
  return x + ',' + y;
}

export function getGrid<T>(width: number, height: number, value?: T): T[][] {
  return value
    ? new Array(width).fill(1).map(() => new Array(height).fill(value))
    : new Array(width).fill(1).map(() => new Array(height));
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

export function getNewDirection(action: ID): Direction | null {
  switch (action) {
    case ID.MOVE_UP:
      return Direction.N;
    case ID.MOVE_DOWN:
      return Direction.S;
    case ID.MOVE_LEFT:
      return Direction.W;
    case ID.MOVE_RIGHT:
      return Direction.E;
    default:
      return null;
  }
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
