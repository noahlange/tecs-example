import type { JSX } from 'preact';
import { h } from 'preact';
import type { UITextMessage } from '../../types';

import DialogueOptions from './DialogueOptions';

import './styles.scss';

interface DialogueProps {
  item: UITextMessage;
  options: UITextMessage[];
  onSelectOption: (index: number) => void;
}

export default function Dialogue(props: DialogueProps): JSX.Element {
  return (
    <div id="dialogue">
      <div className="dialogue-text">{props.item?.text}</div>
      <DialogueOptions
        options={props.options}
        onSelect={props.onSelectOption}
      />
    </div>
  );
}
