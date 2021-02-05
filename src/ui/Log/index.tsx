import type { JSX } from 'preact';
import { h, Component } from 'preact';

import './styles.scss';

export interface LogProps {
  items: { text: string; title: string }[];
}

function getOpacity(index: number, total: number): number {
  const place = total - index;
  return 1 / place;
}

export default class Log extends Component<LogProps> {
  public render(): JSX.Element {
    return (
      <div className="log">
        <ul>
          {this.props.items.map((item, i, items) => {
            const opacity = getOpacity(i, items.length);
            return (
              <li style={{ opacity }} key={i}>
                {item.text}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
