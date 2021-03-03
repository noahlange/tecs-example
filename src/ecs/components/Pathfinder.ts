import { Component } from 'tecs';
import type { Point } from '../../types';

export class Pathfinder extends Component {
  public static readonly type = 'pathfinder';
  public destination: Point | null = null;
  public isVisible: boolean = false;
  public isActive: boolean = false;
  public path: Point[] = [];
}
