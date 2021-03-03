export abstract class AsyncWorker<I, O> {
  public static readonly url: string;
  protected worker: Worker;

  public init?: () => Promise<void> | void;

  public async execute(input: I): Promise<O> {
    return new Promise((resolve, reject) => {
      this.worker.onerror = reject;
      this.worker.onmessage = res => resolve(res.data as O);
      this.worker.postMessage(input);
    });
  }

  public constructor() {
    const Ctor = this.constructor as typeof AsyncWorker;
    this.worker = new Worker(new URL(Ctor.url, import.meta.url));
  }
}
