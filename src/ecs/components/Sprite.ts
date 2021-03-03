import { Component } from 'tecs';
import type { RGBColor } from '../../types';
import { T } from '../../utils';

export class Sprite extends Component {
  public static readonly type = 'sprite';
  public key: string = T.BLANK;
  public tint: RGBColor | null = [255, 255, 255];
  public alpha: number = 1;
}
