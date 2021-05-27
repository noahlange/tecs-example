import { readFile, writeFile } from 'fs/promises';
import { basename } from 'path';
import { PNG } from 'pngjs';

import getAnimations from './getAnimations';
import getFrames from './getFrames';

export default async function createAtlas(filename: string): Promise<void> {
  const buf = await readFile(filename);
  const png = PNG.sync.read(buf);
  const frames = await getFrames(filename);
  const animations = await getAnimations();
  const out = filename.replace(/png/, 'json');

  const meta = {
    name: basename(out, '.json'),
    image: filename,
    size: { w: png.width, h: png.height },
    scale: '1'
  };

  await writeFile(out, JSON.stringify({ meta, frames, animations }));
  console.log(`wrote atlas to ${out}`);
}
