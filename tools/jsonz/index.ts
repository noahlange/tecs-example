import { readFile, stat, writeFile } from 'fs/promises';
import { deflate, inflate } from 'pako';
import { resolve } from 'path';

(async () => {
  const command = process.argv[2];
  const file = resolve(process.cwd(), process.argv[3]);

  try {
    await stat(file);
  } catch (e) {
    console.error(`failed: file "${file}" does not exist`);
    process.exit(1);
  }

  const buffer = await readFile(file);

  switch (command) {
    case 'unzip': {
      const text = inflate(buffer, { to: 'string' });
      const name = file.replace('.jsonz', '.json');
      await writeFile(name, text);
      console.log(`success: output written to "${name}"`);
      break;
    }
    case 'zip': {
      const name = file.replace('.jsonz', '.json');
      await writeFile(name, deflate(buffer));
      console.log(`success: output written to "${name}"`);
      break;
    }
  }

  process.exit(0);
})();
