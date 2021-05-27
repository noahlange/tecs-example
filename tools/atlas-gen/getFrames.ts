import c from 'ansi-colors';
import enquirer from 'enquirer';
import { readFile } from 'fs/promises';
import { PNG } from 'pngjs';

import { run } from '../utils';

const { NumberPrompt } = enquirer as any;

interface AtlasFrame {
  frame: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
  pivot: { x: number; y: number };
}

export default async function getFrames(
  filename: string
): Promise<Record<number, AtlasFrame>> {
  const png = PNG.sync.read(await readFile(filename));
  console.log(c.dim(`  Dimensions: ${png.width}x${png.height}`));

  const w = await run(
    new NumberPrompt({ message: 'Frame width', initial: 128 })
  );

  const h = await run(
    new NumberPrompt({ message: 'Frame height', initial: w })
  );

  const yCount = Math.floor(png.height / h);
  const xCount = Math.floor(png.width / w);

  console.log(c.dim(`  ${xCount * yCount} frames: ${xCount}x${yCount}`));

  let i = 0;
  const frames: Record<number, AtlasFrame> = {};
  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      frames[i++] = {
        frame: { x: x * w, y: y * h, w, h },
        sourceSize: { w, h },
        pivot: { x: 0.5, y: 1 }
      };
    }
  }

  return frames;
}
