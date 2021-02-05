import { Component } from 'tecs';
import { UIMode } from '../types';

export class Game extends Component {
  public static readonly type = 'game';
  public width: number = 0;
  public height: number = 0;
  public mode: UIMode = UIMode.DEFAULT;
}
