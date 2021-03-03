import type { DamageDefinition } from '@types';
import type { EntityType } from 'tecs';
import { Component } from 'tecs';
import { EquipSlot } from '@types';
import type { Equipped } from './Equipped';

export class Equippable extends Component {
  public static readonly type = 'equip';
  public slot: EquipSlot = EquipSlot.ITEM_NONE;
  public isEquipped: boolean = false;
  public owner!: EntityType<[typeof Equipped]>;

  public damage: DamageDefinition[] = [];
  public resist: DamageDefinition[] = [];
}
