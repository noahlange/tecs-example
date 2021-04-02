import type { Vector2 } from '@types';
import type { Direction } from '@enums';
import { AOE } from '@enums';
import { RNG, getTargetAOE } from '@utils';
import { Component } from 'tecs';

export class AreaOfEffect extends Component {
  public static readonly type = 'aoe';

  public type: AOE = AOE.LINE;
  public range: number = 1;

  public all(source: Vector2 & { d: Direction }): Vector2[] {
    return getTargetAOE(source, this.type, this.range);
  }

  public pick(
    source: Vector2 & { d: Direction },
    count: number = 1
  ): Vector2[] {
    const res: Vector2[] = [];
    const all = this.all(source);
    while (count--) {
      res.push(RNG.pick(all));
    }
    return res;
  }
}
