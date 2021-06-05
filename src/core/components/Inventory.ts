import type { InventoryItem } from '@game/entities';

import { Component } from 'tecs';

export class Inventory extends Component {
  public static readonly type = 'inventory';
  public items: InventoryItem[] = [];
}
