import type { Color } from '@types';
import { Component } from 'tecs';

export class LightSource extends Component {
  public static readonly type = 'light';
  public color: Color = { r: 240, g: 240, b: 30, a: 1 };
}
