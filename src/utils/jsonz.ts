import pako from 'pako';

export async function read<T = any>(file: string): Promise<T> {
  const name = file.replace(/\.jsonz?$/, '');
  try {
    const res = await fetch(name + '.jsonz').then(res => res.arrayBuffer());
    const data = new Uint8Array(res);
    const str = pako.inflate(data, { to: 'string' });
    return JSON.parse(str);
  } catch (e) {
    return fetch(name + '.json').then(res => res.json());
  }
}
