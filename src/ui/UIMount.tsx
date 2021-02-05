import type { JSX } from 'preact';
import { h } from 'preact';

import type { UITextMessage } from '../types';
import { UIMode } from '../types';
import Dialogue from './Dialogue';
import Log from './Log';

import './styles.scss';

export type MountProps =
  | { mode: null }
  | { mode: UIMode.DEFAULT; items: UITextMessage[] }
  | {
      mode: UIMode.DIALOGUE;
      item: UITextMessage;
      options: UITextMessage[];
      onSelectOption: (index: number) => void;
    };

export default function UIMount(props: MountProps): JSX.Element | null {
  if (props.mode === null) {
    return null;
  }

  switch (props.mode) {
    case UIMode.DEFAULT:
      return <Log items={props.items} />;
    case UIMode.DIALOGUE: {
      return (
        <Dialogue
          item={props.item}
          options={props.options}
          onSelectOption={props.onSelectOption}
        />
      );
    }
    default: {
      return <div />;
    }
  }
}
