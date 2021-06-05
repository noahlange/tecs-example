import type { IsEquipment } from '@core/components';
import type { CombatEntity } from '@game/entities/types';
import type { DamageType } from '@game/enums';
import type { Context, EntityType } from 'tecs';

import {
  Actor,
  Combatant,
  HasEquipment,
  Position,
  Text
} from '@core/components';
import { Stats } from '@game/components';
import { _, RNG } from '@utils';

function getDamage(
  source: CombatEntity,
  target: CombatEntity,
  attack: EntityType<[typeof IsEquipment]>
): { [key in DamageType]?: number } {
  return attack.$.equip.damage.reduce(
    (a: { [key in DamageType]?: number }, b) => ({
      ...a,
      [b.type]: (a[b.type] ?? 0) + RNG.roll(b.value)
    }),
    {}
  );
}

function getResistance(
  source: CombatEntity,
  target: CombatEntity,
  attack: EntityType<[typeof IsEquipment]>
): { [key in DamageType]?: number } {
  return Array.from(target.$.equipped.resist).reduce(
    (a, [type, value]) => ({ ...a, [type]: value }),
    {}
  );
}

/**
 * Damage calculations. These would be overidden on a per-user basis.
 */
export function applyDamage(
  source: CombatEntity,
  target: CombatEntity,
  attack: EntityType<[typeof IsEquipment]>
): void {
  const resist = getResistance(source, target, attack);
  const damage = getDamage(source, target, attack);

  const total = _.entries(damage).reduce((a, [type, damage]) => {
    return damage ? a + (damage - (resist[type] ?? 0)) : a;
  }, 0);

  target.$.stats.health.value = _.clamp(
    target.$.stats.health.value - total,
    0,
    target.$.stats.maxHP
  );
}

export function queryCombatEntities(ctx: Context): Iterable<CombatEntity> {
  return ctx.$.components(
    Combatant,
    Actor,
    Stats,
    Position,
    HasEquipment,
    Text
  ).persist();
}
