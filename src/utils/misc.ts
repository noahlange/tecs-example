/**
 * Yield numbers from `0` → `count` (positive) or `count` → `0` (negative).
 * @param d - direction; negative (right to left) or positive/zero (left to right)
 * @param range - [ min, max ]
 */
export function* iterateAcross(
  d: number,
  range: [number, number]
): IterableIterator<number> {
  const min = Math.min(...range);
  const max = Math.max(...range);
  if (d >= 0) {
    for (let i = min; i <= max; i++) {
      yield i;
    }
  } else {
    for (let i = max; i >= min; i--) {
      yield i;
    }
  }
}

export function work(
  worker: Worker,
  persist: boolean = false
): { run<I, O>(data: I): Promise<O> } {
  return {
    async run<I, O>(data: I): Promise<O> {
      return new Promise((resolve, reject) => {
        worker.onerror = reject;
        worker.onmessage = res => {
          if (!persist) {
            worker.terminate();
          }
          resolve(res.data);
        };
        worker.postMessage(data);
      });
    }
  };
}

export function keys<T, K extends keyof T>(object: T): K[] {
  return Object.keys(object) as K[];
}

export function values<T, K extends keyof T>(object: T): T[K][] {
  return Object.values(object);
}

export function entries<T, K extends keyof T>(object: T): [K, T[K]][] {
  return Object.entries(object) as [K, T[K]][];
}
