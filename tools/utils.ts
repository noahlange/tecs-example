interface Runnable<T = unknown> {
  run(): Promise<T>;
}

export async function run(...prompts: Runnable[]): Promise<any> {
  return await prompts.reduce(
    async (a, b: Runnable<any>) => (await a).concat(await b.run()),
    Promise.resolve([])
  );
}

export async function sequence(
  ...prompts: ((value: any) => Runnable | Promise<Runnable>)[]
): Promise<any> {
  return await prompts.reduce(
    async (a: Promise<any>, b) => (await b(await a)).run(),
    Promise.resolve(null)
  );
}
