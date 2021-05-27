import enquirer from 'enquirer';
import globby from 'globby';
import { resolve } from 'path';

import { sequence } from '../utils';
import createAtlas from './atlasCreate';
import updateAtlas from './atlasUpdate';

const { AutoComplete, Input, Confirm } = enquirer as any;

const msg = {
  create: 'Create new atlas?',
  glob: 'File glob',
  source: 'Filename'
};

export default (async () => {
  const source = await sequence(
    async () => new Confirm({ message: msg.create, initial: true }),
    async (create: boolean) => {
      const initial = create ? '**/*.png' : '**/*.json';
      return new Input({ message: msg.glob, initial });
    },
    async (...globs: string[]) => {
      const choices = await globby(globs);
      return new AutoComplete({ limit: 3, message: msg.source, choices });
    }
  );

  const filename = resolve(process.cwd(), source);

  await (source.endsWith('.json')
    ? updateAtlas(filename)
    : createAtlas(filename));
})();
