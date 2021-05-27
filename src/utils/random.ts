import { Seeder } from '@lib';
import { customRandom, urlAlphabet } from 'nanoid';
import Roll from 'roll';
import seedrandom from 'seedrandom';

interface RandomNumber {
  (): number;
  between(min: number, max: number): number;
}

export let random = seedrandom.alea('initial_seed');

export function setSeed(seed: string): void {
  random = seedrandom.alea(seed);
}

export function useSeed<T>(seed: string, callback: () => T): T {
  // get current seed
  const start = Seeder.seed ?? 'initial_seed';
  // set new seed
  Seeder.set(seed);
  // do stuff
  const res = callback();
  // replace old seed
  Seeder.set(start);
  return res;
}

export const float: RandomNumber = Object.assign((): number => random.quick(), {
  between(min: number, max: number): number {
    return random.quick() * (max - min) + min;
  }
});

export const int: RandomNumber = Object.assign((): number => random.int32(), {
  between(min: number, max: number): number {
    return Math.floor(random.quick() * (max - min) + min);
  }
});

export function pick<T>(array: T[]): T {
  return array[int.between(0, array.length - 1)];
}

/**
 * A quick 50/50 coin flip.
 */
export function flip(): boolean {
  return random.quick() > 0.5;
}

// fisher-yates shuffle
export function shuffle<T>(items: T[]): T[] {
  const res = items.slice();
  let i = res.length;
  if (i) {
    while (--i) {
      const next = int.between(0, i + 1);
      [res[i], res[next]] = [res[next], res[i]];
    }
  }
  return res;
}

interface Roller {
  (str: string): number;
  roller: Roll;
}

export const roll: Roller = (() => {
  const roller = new Roll(() => float());
  return Object.assign((str: string) => roller.roll(str).result, { roller });
})();

export const id = customRandom(urlAlphabet, 8, size => {
  return new Uint8Array(size).map(() => 256 * random());
});
