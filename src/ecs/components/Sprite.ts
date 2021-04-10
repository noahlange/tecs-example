import type { Color } from '@types';
import { simplify } from '@utils/colors';
import { Component } from 'tecs';
import { T } from '../../utils';

export class Sprite extends Component {
  public static readonly type = 'sprite';
  public key: string = T.BLANK;
  public pixi: PIXI.Sprite | null = null;
  public tint: Color | null = { r: 255, g: 255, b: 255, a: 1 };

  public toJSON(): { key: string; tint: Color | null; pixi: null } {
    return {
      key: this.key,
      tint: this.tint ? simplify(this.tint) : null,
      pixi: null
    };
  }
}
