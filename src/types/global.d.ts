interface Window {
  LOAD_TEST: boolean;
}

declare module '*.png';

declare module '*?worker' {
  interface ViteWorkerConstructor {
    new (): Worker;
  }

  const foo: ViteWorkerConstructor;

  export default foo;
}
