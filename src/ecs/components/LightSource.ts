import { Component } from 'tecs';
import type { RGBColor } from '../../types';

export class LightSource extends Component {
  public static readonly type = 'light';
  public color: RGBColor = [240, 240, 30];
}
