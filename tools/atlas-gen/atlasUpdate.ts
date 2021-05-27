import c from 'ansi-colors';
import { readFile, writeFile } from 'fs/promises';

import getAnimations from './getAnimations';

export default async function updateAtlas(filename: string): Promise<void> {
  const file = await readFile(filename, 'utf8');
  const atlas = JSON.parse(file);
  const anims = atlas.animations as Record<string, string[]>;

  console.log(c.dim(`add animations: '${Object.keys(anims).join("', '")}'`));

  const [name, last] = Object.entries(anims).pop() ?? [null, []];
  const duration = last ? last.length : 0;
  const index = last ? +last[last.length - 1] + 1 : 0;

  const f = atlas.frames[index];
  if (f) {
    console.log(c.dim(`resuming animations after '${name}'`));
  }

  const res = await getAnimations(index, duration);
  const content = { ...atlas, animations: { ...anims, ...res } };

  await writeFile(filename, JSON.stringify(content, null, 2), 'utf8');
  console.log(`wrote atlas to ${filename}`);
}
