import type { Vector2 } from '@lib/types';

import { Component } from 'tecs';

export class View extends Component {
  public static readonly type = 'view';
  public range = 10;
  public visible: Vector2[] = [];
}
