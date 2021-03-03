import type { Point } from '@types';
import { AOE, Direction } from './enums';

type WithDirection = Point & { d: Direction };

function getLinePoints(point: WithDirection, range: number): Point[] {
  let { x, y } = point;
  const res = [];
  while (range) {
    switch (point.d) {
      case Direction.N:
        res.push({ x, y: y-- });
        break;
      case Direction.NW:
        res.push({ x: x--, y: y-- });
        break;
      case Direction.W:
        res.push({ x: x--, y });
        break;
      case Direction.SW:
        res.push({ x: x--, y: y++ });
        break;
      case Direction.S:
        res.push({ x, y: y++ });
        break;
      case Direction.SE:
        res.push({ x: x++, y: y++ });
        break;
      case Direction.E:
        res.push({ x: x++, y: y });
        break;
      case Direction.NE:
        res.push({ x: x++, y: y-- });
        break;
    }
    range--;
  }
  return res;
}

function getCirclePoints(center: Point, radius: number): Point[] {
  const points = new Set<Point>();
  let r = 0;
  while (r < radius) {
    r++;
    // make a square
    for (let x = -r + 1; x < r; x++) {
      for (let y = -r + 1; y < r; y++) {
        points.add({ x, y });
      }
    }

    for (const point of points) {
      // remove points whose distance from 0 is >r
      const d = Math.sqrt(point.x ** 2 + point.y ** 2);
      if (Math.round(d) >= r) {
        points.delete(point);
      }
    }
  }

  return Array.from(points).map(point => ({
    x: point.x + center.x,
    y: point.y + center.y
  }));
}

function getCrossPoints(source: WithDirection, range: number): Point[] {
  return [
    ...getLinePoints({ ...source, d: source.d }, range),
    ...getLinePoints({ ...source, d: (source.d + 2) % 8 }, range),
    ...getLinePoints({ ...source, d: (source.d + 4) % 8 }, range),
    ...getLinePoints({ ...source, d: (source.d + 6) % 8 }, range)
  ];
}

function getHemispherePoints(center: WithDirection, radius: number): Point[] {
  const points = getCirclePoints(center, radius);
  const [cx, cy] = [center.x, center.y];

  const filters: Record<Direction, (point: Point) => boolean> = {
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
): Point[] {
  const points: Point[] = [];
  switch (aoe) {
    case AOE.LINE:
      return getLinePoints(source, range);
    case AOE.CIRCLE:
      return getCirclePoints(source, range);
    case AOE.SEMICIRCLE:
      return getHemispherePoints(source, range);
    case AOE.CROSS:
      return getCrossPoints(source, range);
  }
  return points;
}
