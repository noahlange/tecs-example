import type { Atlas } from '@lib/types';

import { Direction } from '@lib/enums';
import { Component } from 'tecs';

const dirKey: Record<Direction, string> = {
  [Direction.N]: 'n',
  [Direction.S]: 's',
  [Direction.E]: 'e',
  [Direction.W]: 'w',
  [Direction.NW]: 'nw',
  [Direction.NE]: 'ne',
  [Direction.SW]: 'sw',
  [Direction.SE]: 'se'
};

export class Animated extends Component {
  public static readonly type = 'animation';

  public atlas!: Atlas;
  // e.g., walk (where walk.0 is north, etc)
  public animation: string | null = null;
  public index: number | null = null;
  public dt: number = 0;
  public fps = 16;
  public reset: string | null = null;

  public getFrames(direction: Direction): string[] {
    const name = [this.animation, dirKey[direction]].join('.');
    return this.atlas.animations[name] ?? [];
  }

  public getFrameKey(direction: Direction): string | null {
    if (this.animation && this.index !== null) {
      const animationName = [this.animation, dirKey[direction]].join('.');
      if (animationName in this.atlas.animations) {
        return [
          this.atlas.meta.name,
          this.atlas.animations[animationName][this.index]
        ].join('.');
      }
    }
    return this.reset;
  }
}
