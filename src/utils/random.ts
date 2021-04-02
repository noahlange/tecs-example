import seedrandom from 'seedrandom';
import Roll from 'roll';
import { RNG } from '@utils';
import { Seeder } from '@lib';

interface RandomNumber {
  (): number;
  between(min: number, max: number): number;
}

export let random = seedrandom.alea('initial_seed');

export function setSeed(seed: string): void {
  random = seedrandom.alea(seed);
}

export function useSeed(seed: string, callback: () => void): void {
  // get current seed
  const start = Seeder.seed ?? 'initial_seed';
  // set new seed
  Seeder.set(seed);
  // do stuff
  callback();
  // replace old seed
  Seeder.set(start);
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
  const roller = new Roll(() => RNG.float());
  return Object.assign((str: string) => roller.roll(str).result, { roller });
})();
