import type { Equipped } from './Equipped';
import type { DamageDefinition } from '@lib/types';
import type { EntityType } from 'tecs';

import { EquipSlot } from '@lib/enums';
import { Component } from 'tecs';

export class Equippable extends Component {
  public static readonly type = 'equip';
  public slot: EquipSlot = EquipSlot.ITEM_NONE;
  public isEquipped: boolean = false;
  public owner!: EntityType<[typeof Equipped]>;
  public sprite?: string;

  public damage: DamageDefinition[] = [];
  public resist: DamageDefinition[] = [];
}
