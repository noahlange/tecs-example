import type { Color } from '../../lib/types';
import type * as PIXI from 'pixi.js';

import { RGB, T } from '@utils';
import { Component } from 'tecs';

export class Sprite extends Component {
  public static readonly type = 'sprite';
  public key: string = T.BLANK;
  public pixi: PIXI.Sprite | null = null;
  public tint: Color | null = { r: 255, g: 255, b: 255, a: 1 };

  public toJSON(): { key: string; tint: Color | null; pixi: null } {
    return {
      key: this.key,
      tint: this.tint ? RGB.simplify(this.tint) : null,
      pixi: null
    };
  }
}
