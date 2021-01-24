import { Component } from 'tecs';

export class Position extends Component {
  public static readonly type = 'position';
  public x: number = 0;
  public y: number = 0;
  public r: number = 0;
}
