import { Attribute } from '@lib';
import { Component } from 'tecs';

export class Stats extends Component {
  public static readonly type = 'stats';
  public hpMax: number = 100;
  public hp: number = 100;

  public dex: Attribute = new Attribute();
  public agi: Attribute = new Attribute();
  public con: Attribute = new Attribute();
  public int: Attribute = new Attribute();
  public per: Attribute = new Attribute();
  public cha: Attribute = new Attribute();
  public arc: Attribute = new Attribute();
}
