import { Component } from 'tecs';
import type { RGBColor } from '../types';

/**
 * Something that can have its color affected by lighting.
 */
export class Renderable extends Component {
  public static readonly type = 'render';
  public active: boolean = false;
  public fg: RGBColor | null = null;
  public bg: RGBColor | null = null;
}
