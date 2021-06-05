import type { DamageDefinition, ItemEffect } from '@lib/types';

import { EquipSlot } from '@game/enums';
import { Component } from 'tecs';

export class IsEquipment extends Component {
  public static readonly type = 'equip';
  public slot: EquipSlot = EquipSlot.ITEM_NONE;
  public isEquipped: boolean = false;
  public sprite?: string;

  public damage: DamageDefinition[] = [];
  public resist: DamageDefinition[] = [];
  public effects: ItemEffect[] = [];
  public bonuses: ItemEffect[] = [];
}
