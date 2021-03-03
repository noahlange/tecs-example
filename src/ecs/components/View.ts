import { Component } from 'tecs';
import type { Point } from '../../types';

export class View extends Component {
  public static readonly type = 'view';
  public range = 10;
  public visible: Point[] = [];
}
