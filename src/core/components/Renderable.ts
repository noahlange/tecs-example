import type { Color } from '../../lib/types';

import { RGB } from '@utils';
import { Component } from 'tecs';

interface RenderableOutput {
  fg: Color | null;
  bg: Color | null;
}
/**
 * Something that can have its color affected by lighting.
 */
export class Renderable extends Component {
  public static readonly type = 'render';
  public dirty: boolean = false;
  public fg: Color | null = null;
  public bg: Color | null = null;

  public toJSON(): RenderableOutput {
    return {
      fg: this.fg ? RGB.simplify(this.fg) : null,
      bg: this.bg ? RGB.simplify(this.bg) : null
    };
  }
}
