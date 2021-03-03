import { h } from 'preact';
import type { JSX } from 'preact';

import './styles.scss';

export interface DialogueOptionsProps {
  text: string;
  options: string[];
  onSelectOption: (index: number) => void;
}

export function DialogueUI(props: DialogueOptionsProps): JSX.Element {
  return (
    <div>
      <div className="dialogue-text">{props.text}</div>
      <div className="dialogue-options">
        <ol>
          {props.options.map((item, i) => {
            return (
              <li key={i}>
                <button onClick={() => props.onSelectOption(i)}>{item}</button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
