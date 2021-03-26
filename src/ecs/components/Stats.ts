import { HealthBar } from '@lib';
import { Component } from 'tecs';
import { Attribute } from '@enums';
import { StatAttribute } from '../../rpg/StatAttribute';

export class Stats extends Component {
  public static readonly type = 'stats';
  public maxHP: number = 100;
  public health = new HealthBar(this.maxHP);

  public [Attribute.DEX]: StatAttribute = new StatAttribute(Attribute.DEX);
  public [Attribute.AGI]: StatAttribute = new StatAttribute(Attribute.AGI);
  public [Attribute.CON]: StatAttribute = new StatAttribute(Attribute.CON);
  public [Attribute.INT]: StatAttribute = new StatAttribute(Attribute.INT);
  public [Attribute.PER]: StatAttribute = new StatAttribute(Attribute.PER);
  public [Attribute.CHA]: StatAttribute = new StatAttribute(Attribute.CHA);
  public [Attribute.MAG]: StatAttribute = new StatAttribute(Attribute.MAG);
}
