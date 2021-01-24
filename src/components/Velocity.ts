import { Component } from 'tecs';

export class Velocity extends Component {
  public static readonly type = 'velocity';
  public dx: number = 0;
  public dy: number = 0;
}
