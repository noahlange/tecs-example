import type { RGBColor } from '../../types';
import { Component } from 'tecs';

/**
 * Something that can have its color affected by lighting.
 */
export class Renderable extends Component {
  public static readonly type = 'render';
  public dirty: boolean = false;
  public fg: RGBColor | null = null;
  public bg: RGBColor | null = null;
  public order: number = 0;
}
