import { Component } from 'tecs';
import type { ItemType } from '../../types';

export class Item extends Component {
  public static readonly type = 'item';
  public type: ItemType | null = null;
  public count: number = 1;
  public weight: number = 0;
  public value: number = 0;
  public description: string = '';
}
