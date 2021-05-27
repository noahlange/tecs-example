import c from 'ansi-colors';
import enquirer from 'enquirer';

import { run, sequence } from '../utils';
const { Input, NumberPrompt, MultiSelect, Sort } = enquirer as any;

const map: Record<string, string> = {
  '-': '',
  North: 'n',
  South: 's',
  East: 'e',
  West: 'w',
  Northwest: 'nw',
  Southwest: 'sw',
  Southeast: 'se',
  Northeast: 'ne'
};

const choices = [
  { name: '-' },
  { name: 'South' },
  { name: 'East' },
  { name: 'West' },
  { name: 'North' },
  { name: 'Southwest' },
  { name: 'Northwest' },
  { name: 'Southeast' },
  { name: 'Northeast' }
];

const msg = {
  name: 'Animation name (enter to cancel)',
  start: 'Start frame #',
  duration: 'Frame duration',
  dirSelect: 'Select directions',
  dirSort: 'Sort directions'
};

export default async function getAnimations(
  start = 0,
  count = 0
): Promise<Record<string, string[]>> {
  let canceled = false;

  const animations: Record<string, string[]> = {};
  while (!canceled) {
    const [name] = await run(new Input({ message: msg.name }));

    if (name !== '') {
      // eslint-disable-next-line prefer-const
      let [frame, duration] = await run(
        new NumberPrompt({ message: msg.start, initial: +start }),
        new NumberPrompt({ message: msg.duration, initial: count })
      );

      const directions: string[] = await sequence(
        () =>
          new MultiSelect({
            message: msg.dirSelect,
            choices,
            initial: choices.filter((_, i) => !!i)
          }),
        (unsorted: typeof choices) =>
          new Sort({ message: msg.dirSort, choices: unsorted })
      );

      for (const direction of directions.map(d => map[d])) {
        const animation = direction ? `${name}.${direction}` : name;
        const frames = [];

        for (let frame = 0; frame < duration; frame++) {
          frames.push(frame + frame);
        }

        console.log(
          c.dim(`  added "${animation}" (${frame + 1}-${frame + duration})`)
        );

        animations[animation] = frames.map(frame => frame.toString());

        duration = count;
        start += count;
      }
    } else {
      canceled = true;
    }
  }
  return animations;
}
