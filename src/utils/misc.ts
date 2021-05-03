export function keys<T, K extends keyof T>(object: T): K[] {
  return Object.keys(object) as K[];
}

export function values<T, K extends keyof T>(object: T): T[K][] {
  return Object.values(object);
}

export function entries<T, K extends keyof T>(object: T): [K, T[K]][] {
  return Object.entries(object) as [K, T[K]][];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
