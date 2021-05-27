import type { Vector2 } from '@lib/types';

import { Direction } from '@lib/enums';
import { toChunkPosition } from '@utils/geometry';
import { Component } from 'tecs';

export class Position extends Component {
  public static readonly type = 'position';
  public d: Direction = Direction.N;
  public z: number = 1;

  public x: number = 0;
  public y: number = 0;

  public get chunk(): [Vector2, Vector2] {
    return toChunkPosition(this);
  }
}
