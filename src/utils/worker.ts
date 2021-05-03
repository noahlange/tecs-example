interface WorkerRunner {
  run<I, O>(data: I): Promise<O>;
  exec<I, O>(data: I[]): AsyncIterable<O[]>;
}

export function work(worker: Worker, persist: boolean = false): WorkerRunner {
  const run = <I, O>(data: I): Promise<O> => {
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
  };

  return {
    exec<I, O>(data: I[]): AsyncIterable<O[]> {
      return {
        [Symbol.asyncIterator]() {
          const next = data.shift();
          return {
            done: data.length > 0,
            next: () => run(next)
          };
        }
      };
    },
    run
  };
}
