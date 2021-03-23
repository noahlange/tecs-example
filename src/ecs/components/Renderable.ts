import type { Color } from '@types';
import { Component } from 'tecs';

/**
 * Something that can have its color affected by lighting.
 */
export class Renderable extends Component {
  public static readonly type = 'render';
  public dirty: boolean = false;
  public fg: Color | null = null;
  public bg: Color | null = null;
}
