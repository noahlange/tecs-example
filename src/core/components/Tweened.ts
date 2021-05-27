import type { Tween } from '@tweenjs/tween.js';

import { Component } from 'tecs';

export class Tweened extends Component {
  public static readonly type = 'tween';

  public active: boolean = false;
  public tween: Tween<any> | null = null;
}
