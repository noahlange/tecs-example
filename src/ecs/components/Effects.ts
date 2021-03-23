import type { ItemEffect } from '@types';
import { Component } from 'tecs';

export class Effects extends Component {
  public static readonly type = 'effects';
  public effects: ItemEffect[] = [];

  public *[Symbol.iterator](): Iterator<ItemEffect> {
    yield* this.effects;
  }
}
