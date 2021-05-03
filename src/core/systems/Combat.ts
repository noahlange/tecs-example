import type { Vector2 } from '../../lib/types';
import type { CombatEntity } from '@core/entities/types';
import type { DamageType, Direction } from '@lib/enums';
import type { CombatAttackAction } from '@utils';

import {
  Actor,
  Combatant,
  Equipped,
  Position,
  Stats,
  Text
} from '@core/components';
import { Vector2Array } from '@lib';
import { Action } from '@lib/enums';
import { roll } from '@utils';
import { getInteractionPos } from '@utils/geometry';
import { System } from 'tecs';

type AttackData = CombatAttackAction & { target: Vector2 & { d: Direction } };

export class Combat extends System {
  public static readonly type = 'combat';

  protected $ = {
    combatants: this.world.query
      .components(Combatant, Actor, Stats, Position, Equipped, Text)
      .persist()
  };

  public tick(): void {
    const size = { width: 0, height: 0 };
    // @todo: get combatants' bounds (use area?)
    const combatants = new Vector2Array<CombatEntity>(size);
    const attacks = new Vector2Array<Set<AttackData>>(size);

    for (const entity of this.$.combatants) {
      combatants.set(entity.$.position, entity);
    }

    for (const entity of this.$.combatants) {
      switch (entity.$.action.data.id) {
        case Action.COMBAT_ATTACK: {
          const set = attacks.get(entity.$.position, new Set());
          const data = entity.$.action.data;
          attacks.set(
            data.target ?? getInteractionPos(entity.$.position),
            set.add({
              ...data,
              target: { d: entity.$.position.d, ...data.target }
            })
          );
          entity.$.action.data = { id: Action.NONE };
        }
      }
    }

    for (const [, attackItems] of attacks.entries()) {
      // redundant...
      for (const a of attackItems) {
        // find combatants within targeted cells (defaulting to the square immediately to the front of the attacker)
        const { $ } = a.attack;
        const points = $.aoe.all(a.target);
        // roll damage once
        const damage = $.equip.damage.reduce(
          (a, d) => a.set(d.type, roll(d.value)),
          new Map<DamageType, number>()
        );

        for (const point of points) {
          // target in range
          const target = combatants.get(point);
          if (target) {
            const resist = target.$.equipped.resist;
            // start summing damage
            let total = 0;
            for (const [type, value] of damage.entries()) {
              const r = resist.get(type) ?? 0;
              total += Math.max(0, value - r);
            }
            // sub from health
            // target.$.stats.health.set(
            //   Math.max(0, target.$.stats.health.value - total)
            // );

            this.world.game.log(`${target.$.text.title} took ${total} damage`);
          }
        }
        a.attack.destroy();
      }
    }
  }
}
