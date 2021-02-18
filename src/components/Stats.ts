import { Component } from 'tecs';

export class Stats extends Component {
  public static readonly type = 'stats';

  public hpMax: number = 100;
  public hp: number = 100;
}
