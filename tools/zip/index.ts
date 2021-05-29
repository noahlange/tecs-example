import { readFile, stat, writeFile } from 'fs/promises';
import { deflate } from 'pako';
import { resolve } from 'path';

(async () => {
  const file = resolve(process.cwd(), process.argv[2]);
  try {
    await stat(file);
    const data = await readFile(file, 'utf8');
    const res = deflate(data);
    await writeFile(file + 'z', res);
    console.log(`success: output written to "${file}z"`);
  } catch (e) {
    console.error(`failed: file "${file}" does not exist`);
  }
})();
