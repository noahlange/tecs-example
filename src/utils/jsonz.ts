import pako from 'pako';

export async function read<T = any>(file: string): Promise<T> {
  const res = await fetch(file + 'z').then(res => res.arrayBuffer());
  const data = new Uint8Array(res);
  const str = pako.inflate(data, { to: 'string' });
  return JSON.parse(str);
}
