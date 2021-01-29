import { Component } from 'tecs';
import type { RGBColor } from '../types';

export class Glyph extends Component {
  public static readonly type = 'glyph';
  public text!: string;
  public fg: RGBColor = [255, 255, 255];
  public bg: RGBColor = [255, 255, 255];
}
