import { DiggerMap } from './DiggerMap';

self.onmessage = (e: MessageEvent<any>) => {
  const [width, height] = e.data;
  const res = new DiggerMap(width, height);
  // @ts-ignore
  postMessage(res.generate());
};
