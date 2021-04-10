import type { ItemType } from '@enums';
import { nanoid } from 'nanoid/non-secure';
import { Component } from 'tecs';

export class Item extends Component {
  public static readonly type = 'item';
  public type: ItemType | null = null;
  public id: string = nanoid(6);
  public count: number = 1;
  public weight: number = 0;
  public value: number = 0;
  public description: string = '';
}
