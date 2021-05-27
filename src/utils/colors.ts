import type { Color } from '@lib/types';

import { clamp } from './misc';

export function add(a: Color, b: Color): Color {
  return simplify({
    r: a.r + b.r,
    g: a.g + b.g,
    b: a.b + b.b,
    a: 1
  });
}

export function multiply(a: Color, b: Color): Color {
  return simplify({
    r: (a.r * b.r) / 255,
    g: (a.g * b.g) / 255,
    b: (a.b * b.b) / 255,
    a: 1
  });
}

/**
 * Mix two colors, optionally with a weighting percentage.
 * @param a - first color
 * @param b - second color
 * @param percent - weight toward first color (0-1)
 */
export function mix(a: Color, b: Color, percent: number = 0.5): Color {
  const [aPct, bPct] = [percent, 1 - percent];
  return simplify({
    r: a.r * aPct + b.r * bPct,
    g: a.g * aPct + b.g * bPct,
    b: a.b * aPct + b.b * bPct,
    a: 1
  });
}

/**
 * Round and clamp RGB values (0, 255) and alpha value (0, 1).
 */
export function simplify(color: Color): Color {
  return {
    r: clamp(Math.round(color.r), 0, 255),
    g: clamp(Math.round(color.g), 0, 255),
    b: clamp(Math.round(color.b), 0, 255),
    a: Math.round(clamp(color.a, 0, 1) * 100) / 100
  };
}

// https://stackoverflow.com/a/5623914
export function toHex(color: Color): number {
  const { r, g, b } = color;
  return parseInt(
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
    16
  );
}
