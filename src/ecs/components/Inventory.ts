import { Component } from 'tecs';
import type { InventoryItem } from '../entities/types';

export class Inventory extends Component {
  public static readonly type = 'inventory';
  public items: InventoryItem[] = [];
}
