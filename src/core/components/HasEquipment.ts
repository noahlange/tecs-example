import type { DamageType, EquipSlot } from '@game/enums';
import type { queryInventoryItems } from '@game/utils';
import type { UnwrapIterable } from '@utils';

import { RNG } from '@utils';

type InventoryItem = UnwrapIterable<ReturnType<typeof queryInventoryItems>>;

export class HasEquipment {
  public static readonly type = 'equipped';

  public slots: { [key in EquipSlot]?: InventoryItem | null } = {};

  public get resist(): Map<DamageType, number> {
    return Object.values(this.slots).reduce((a, b) => {
      if (b?.$.equip) {
        for (const resistance of b.$.equip.resist ?? []) {
          const val = a.get(resistance.type) ?? 0;
          a.set(resistance.type, val + RNG.roll(resistance.value));
        }
      }
      return a;
    }, new Map<DamageType, number>());
  }
}
