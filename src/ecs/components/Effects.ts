import { Component } from 'tecs';
import type { ItemEffect } from '../../types';

export class Effects extends Component {
  public static readonly type = 'effects';
  public effects: ItemEffect[] = [];

  public *[Symbol.iterator](): Iterator<ItemEffect> {
    yield* this.effects;
  }
}
