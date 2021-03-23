import type { JSX } from 'preact';
import { h, Component } from 'preact';

export class MenuUI extends Component {
  public render(): JSX.Element {
    return (
      <ul>
        <li>New Game</li>
        <li>Load Game</li>
        <li>Options</li>
        <li>Quit</li>
      </ul>
    );
  }
}
