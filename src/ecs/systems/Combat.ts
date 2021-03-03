import type { CombatAttackAction } from '@utils';
import type { Point, Direction, DamageType } from '@types';
import type { CombatEntity } from '@ecs/entities/types';

import { System } from 'tecs';
import {
  Combatant,
  Actor,
  Stats,
  Position,
  Equipped,
  Text
} from '@ecs/components';
import { Array2D } from '@lib';
import { Action, getInteractionPos, roll } from '@utils';

type AttackData = CombatAttackAction & { target: Point & { d: Direction } };

export class Combat extends System {
  public static readonly type = 'combat';

  protected $ = {
    combatants: this.world.query.components(
      Combatant,
      Actor,
      Stats,
      Position,
      Equipped,
      Text
    )
  };

  public tick(): void {
    const size = this.world.game.$.map.size;
    const combatants = new Array2D<CombatEntity>(size);
    const attacks = new Array2D<Set<AttackData>>(size);

    for (const entity of this.$.combatants) {
      combatants.set(entity.$.position, entity);
    }

    for (const entity of this.$.combatants) {
      switch (entity.$.action.data.id) {
        case Action.COMBAT_ATTACK: {
          const set = attacks.get(entity.$.position) ?? new Set();
          const data = entity.$.action.data as CombatAttackAction;
          attacks.set(
            entity.$.action.data.target ?? getInteractionPos(entity.$.position),
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
            target.$.stats.health.set(
              Math.max(0, target.$.stats.health.value - total)
            );

            this.world.game.log(`${target.$.text.title} took ${total} damage`);
          }
        }
        a.attack.destroy();
      }
    }
  }
}
