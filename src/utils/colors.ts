import type { Color } from '../lib/types';

export function add(a: Color, b: Color): Color {
  return {
    r: a.r + b.r,
    g: a.g + b.g,
    b: a.b + b.b,
    a: 1
  };
}

export function multiply(a: Color, b: Color): Color {
  return simplify({
    r: (a.r * b.r) / 255,
    g: (a.g * b.g) / 255,
    b: (a.b * b.b) / 255,
    a: 1
  });
}

export function mix(a: Color, b: Color): Color {
  return simplify({
    r: (a.r + b.r) / 2,
    g: (a.g + b.g) / 2,
    b: (a.b + b.b) / 2,
    a: 1
  });
}

// https://stackoverflow.com/a/5623914
export function toHex(color: Color): number {
  const { r, g, b } = color;
  return parseInt(
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1),
    16
  );
}

export function simplify(color: Color): Color {
  return {
    r: Math.round(color.r),
    g: Math.round(color.g),
    b: Math.round(color.b),
    a: +color.a.toFixed(2)
  };
}
