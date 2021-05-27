import type { Vector2 } from '@lib/types';

import { Component } from 'tecs';

export class Pathfinder extends Component {
  public static readonly type = 'pathfinder';

  public get destination(): Vector2 | null {
    return this.target;
  }

  public set destination(destination: Vector2 | null) {
    this.target = destination;
    this.isActive = destination !== null;
    this.path = [];
  }

  public isVisible: boolean = false;
  public isActive: boolean = false;
  public target: Vector2 | null = null;
  public path: Vector2[] = [];
}
