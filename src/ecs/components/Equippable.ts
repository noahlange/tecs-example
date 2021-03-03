import type { DamageDefinition } from '@types';
import { Component } from 'tecs';
import { EquipSlot } from '@types';

export class Equippable extends Component {
  public static readonly type = 'equip';
  public slot: EquipSlot = EquipSlot.ITEM_NONE;
  public isEquipped: boolean = false;

  public damage: DamageDefinition[] = [];
  public resist: DamageDefinition[] = [];
}
