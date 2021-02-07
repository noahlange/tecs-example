import { Component } from 'tecs';

export class Sprite extends Component {
  public static readonly type = 'sprite';

  public path: string | null = null;
  public anchor: number = 0.5;
}
