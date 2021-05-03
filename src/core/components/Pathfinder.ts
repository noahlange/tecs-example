import type { Vector2 } from '../../lib/types';

import { Component } from 'tecs';

export class Pathfinder extends Component {
  public static readonly type = 'pathfinder';
  public destination: Vector2 | null = null;
  public isVisible: boolean = false;
  public isActive: boolean = false;
  public path: Vector2[] = [];
}
