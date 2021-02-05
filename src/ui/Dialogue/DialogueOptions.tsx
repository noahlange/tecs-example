import type { JSX } from 'preact';
import type { UITextMessage } from '../../types';

import { h, Component } from 'preact';

export interface DialogueOptionsProps {
  options: UITextMessage[];
  onSelect: (index: number) => void;
}

export default class DialogueOptions extends Component<DialogueOptionsProps> {
  public state: { selected: number } = { selected: 0 };

  public render(): JSX.Element {
    const { props } = this;
    return (
      <div className="dialogue-options">
        <ol>
          {props.options.map((item, i) => {
            return (
              <li key={i}>
                <button onClick={() => props.onSelect(i)}>{item.text}</button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}
