import { HealthBar } from '@lib';
import { Component } from 'tecs';

export class Stats extends Component {
  public static readonly type = 'stats';
  public maxHP: number = 100;
  public health = new HealthBar(this.maxHP);
}
