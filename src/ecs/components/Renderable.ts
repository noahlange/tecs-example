import type { Color } from '@types';
import { simplify } from '@utils/colors';
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
      fg: this.fg ? simplify(this.fg) : null,
      bg: this.bg ? simplify(this.bg) : null
    };
  }
}
