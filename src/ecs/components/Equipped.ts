import type { EquippableItem } from '../entities/types';
import { EquipSlot } from '../../types';
import type { DamageType } from '@utils/enums';
import { roll } from '@utils';

export class Equipped {
  public static readonly type = 'equipped';

  public slots: Record<EquipSlot, EquippableItem | null> = {
    [EquipSlot.ITEM_NONE]: null,
    [EquipSlot.WEAPON_MAIN]: null,
    [EquipSlot.WEAPON_OFF]: null,
    [EquipSlot.ARMOR_HEAD]: null,
    [EquipSlot.ARMOR_TORSO]: null,
    [EquipSlot.ARMOR_LEGS]: null,
    [EquipSlot.ARMOR_HANDS]: null,
    [EquipSlot.ARMOR_FEET]: null,
    [EquipSlot.ITEM_RING]: null,
    [EquipSlot.ITEM_AMULET]: null
  };

  public get resist(): Map<DamageType, number> {
    return Object.values(this.slots).reduce((a, b) => {
      for (const r of b?.$.equip.resist ?? []) {
        const val = a.get(r.type) ?? 0;
        a.set(r.type, val + roll(r.value));
      }
      return a;
    }, new Map<DamageType, number>());
  }
}
