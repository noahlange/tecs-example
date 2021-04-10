/**
 * Modify a system's effective tick rate, invoking its `tick` method once every `n` ticks.
 * @param t
 */
export function rate(ticks: number): ClassDecorator {
  const ticker = Symbol('ticker');
  return (constructor: Function) => {
    const originalMethod = constructor.prototype.tick;
    constructor.prototype[ticker] = { count: 0, dt: 0 };
    constructor.prototype.tick = function (dt: number, ts: number): void {
      const tick = this[ticker];
      tick.count++;
      tick.dt += dt;
      if (tick.count === ticks) {
        tick.count = tick.dt = 0;
        originalMethod.call(this, tick.dt, ts);
      }
    };
  };
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
