import { alea } from 'seedrandom';

const random = alea('initial_seed');

export function getUniformInt(min: number, max: number): number {
  return Math.floor(random.quick() * (max - min) + min);
}

export function float(): number {
  return random.quick();
}

export function int(): number {
  return random.int32();
}

export function pick<T>(array: T[]): T {
  return array[getUniformInt(0, array.length - 1)];
}

export function flip(): boolean {
  return random.quick() > 0.5;
}

// fisher-yates shuffle
export function shuffle<T>(items: T[]): T[] {
  let i = items.length;
  if (i) {
    while (--i) {
      const next = getUniformInt(0, i + 1);
      [items[i], items[next]] = [items[next], items[i]];
    }
  }
  return items;
}
