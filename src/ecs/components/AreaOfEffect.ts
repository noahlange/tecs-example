import type { Point, Direction } from '@types';
import { AOE } from '@types';
import { getTargetAOE } from '@utils';
import { Component } from 'tecs';
import { RNG } from 'rot-js';

export class AreaOfEffect extends Component {
  public static readonly type = 'aoe';

  public type: AOE = AOE.LINE;
  public range: number = 1;

  public all(source: Point & { d: Direction }): Point[] {
    return getTargetAOE(source, this.type, this.range);
  }

  public pick(source: Point & { d: Direction }, count: number = 1): Point[] {
    const res: Point[] = [];
    const all = this.all(source);
    while (count--) {
      const next = RNG.getItem(all);
      if (next) {
        res.push(next);
      }
    }
    return res;
  }
}
