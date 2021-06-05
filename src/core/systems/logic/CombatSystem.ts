import type { Direction } from '@lib/enums';
import type { Vector2 } from '@lib/types';
import type { CombatAttackAction, UnwrapIterable } from '@utils';

import { applyDamage, queryCombatEntities } from '@game/utils';
import { Vector2Array } from '@lib';
import { Action } from '@lib/enums';
import { System } from 'tecs';

type CombatEntity = UnwrapIterable<ReturnType<typeof queryCombatEntities>>;

type AttackData = CombatAttackAction & {
  target: Vector2 & { d: Direction };
  source: CombatEntity;
};

export class CombatSystem extends System {
  public static readonly type = 'combat';

  protected $ = {
    combatants: queryCombatEntities(this.ctx)
  };

  public tick(): void {
    const size = { width: 0, height: 0 };
    // @todo: get combatants' bounds (use area?)
    const combatants = new Vector2Array<CombatEntity>(size);
    const attacks = new Set<AttackData>();

    for (const entity of this.$.combatants) {
      combatants.set(entity.$.position, entity);
    }

    for (const entity of this.$.combatants) {
      switch (entity.$.action.data.id) {
        case Action.COMBAT_ATTACK: {
          const data = entity.$.action.data;
          const inUse = data.attack.$.use;

          if (!inUse.active) {
            inUse.active = true;
            attacks.add({
              ...data,
              target: { d: entity.$.position.d, ...data.target },
              source: entity
            });
          } else {
            inUse.tick();
          }

          if (!inUse.active) {
            entity.$.action.data = { id: Action.NONE };
          }
        }
      }
    }

    for (const a of attacks) {
      // find combatants within targeted cells
      const affected = a.attack.$.aoe.all(a.target);
      //
      for (const point of affected) {
        // find any targets in in range
        const target = combatants.get(point);
        if (target) {
          applyDamage(a.source, target, a.attack);
        }
      }

      a.attack.destroy();
    }
  }
}
