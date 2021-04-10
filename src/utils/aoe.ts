import type { Vector2 } from '@types';
import { Vector2Array } from '@lib';
import { AOE, Direction } from '@enums';

type WithDirection = Vector2 & { d: Direction };

// I'm sure that there's a more intelligent way to do this, but that would require me to be more intelligent.
function getRayPoints(point: WithDirection, range: number): Vector2[] {
  let { x, y } = point;
  const res = [];
  while (range) {
    switch (point.d) {
      case Direction.N:
      case Direction.NE:
      case Direction.NW:
        res.push({ x, y: y-- });
        break;
      case Direction.SE:
      case Direction.S:
      case Direction.SW:
        res.push({ x, y: y++ });
        break;
    }
    switch (point.d) {
      case Direction.NE:
      case Direction.E:
      case Direction.SE:
        res.push({ x: x++, y });
        break;
      case Direction.SW:
      case Direction.W:
      case Direction.NW:
        res.push({ x: x--, y });
        break;
    }
    range--;
  }
  return res;
}

export function getCirclePoints(center: Vector2, radius: number): Vector2[] {
  const points = new Vector2Array<boolean>({
    width: radius * 2,
    height: radius * 2
  });
  let r = 0;
  while (r < radius) {
    r++;
    // make a square
    for (let x = -r + 1; x < r; x++) {
      for (let y = -r + 1; y < r; y++) {
        points.set({ x, y }, true);
      }
    }

    for (const [point] of points.entries()) {
      // remove points whose distance from 0 is >r
      const d = Math.sqrt(point.x ** 2 + point.y ** 2);
      if (Math.round(d) >= r) {
        points.delete(point);
      }
    }
  }

  return Array.from(points.keys()).map(point => ({
    x: point.x + center.x,
    y: point.y + center.y
  }));
}

function getCrossPoints(source: WithDirection, range: number): Vector2[] {
  return [
    ...getRayPoints({ ...source, d: source.d }, range),
    ...getRayPoints({ ...source, d: (source.d + 2) % 8 }, range),
    ...getRayPoints({ ...source, d: (source.d + 4) % 8 }, range),
    ...getRayPoints({ ...source, d: (source.d + 6) % 8 }, range)
  ];
}

function getHemispherePoints(center: WithDirection, radius: number): Vector2[] {
  const points = getCirclePoints(center, radius);
  const [cx, cy] = [center.x, center.y];

  const filters: Record<Direction, (point: Vector2) => boolean> = {
    [Direction.W]: p => p.y <= cy,
    [Direction.E]: p => p.y >= cy,
    [Direction.S]: p => p.x >= cx,
    [Direction.N]: p => p.x <= cx,
    // obviously, these are incorrect
    [Direction.SW]: p => p.x <= cx && p.y >= cy,
    [Direction.NW]: p => p.x <= cx && p.y <= cy,
    [Direction.SE]: p => p.x >= cx && p.y >= cy,
    [Direction.NE]: p => p.x >= cx && p.y <= cy
  };

  return points.filter(filters[center.d]);
}

export function getTargetAOE(
  source: WithDirection,
  aoe: AOE,
  range: number
): Vector2[] {
  const points: Vector2[] = [];
  switch (aoe) {
    case AOE.LINE:
      return getRayPoints(source, range);
    case AOE.CIRCLE:
      return getCirclePoints(source, range);
    case AOE.SEMICIRCLE:
      return getHemispherePoints(source, range);
    case AOE.CROSS:
      return getCrossPoints(source, range);
  }
  return points;
}
