import type {
  AI as AIComponent,
  Faction as FactionComponent,
  Pathfinder,
  Text,
  View
} from '../components';
import type { EntityType } from 'tecs';

import { AIState } from '@lib/enums';
import { contains, isSamePoint } from '@utils/geometry';
import { System } from 'tecs';

import { Playable, Position } from '../components';
import { Monster } from '../entities';

type MobType = EntityType<
  [
    typeof Position,
    typeof AIComponent,
    typeof View,
    typeof Pathfinder,
    typeof Text,
    typeof FactionComponent
  ]
>;

export class AI extends System {
  public static readonly type = 'ai';

  protected $ = {
    player: this.ctx.$.components(Playable, Position).persist(),
    mobs: this.ctx.$.entities(Monster).persist()
  };

  protected findMobTarget(mob: MobType): MobType | null {
    // get all targets within the viewshed
    for (const target of this.$.mobs) {
      if (contains(target.$.position, mob.$.view.visible)) {
        const factions = target.$.faction.factions;
        // if no faction overlap, they're enemies
        if (!factions.some(f => mob.$.faction.factions.includes(f))) {
          return target;
        }
      }
    }
    return null;
  }

  protected handleActiveState({ $ }: MobType, target: MobType): void {
    $.ai.state = AIState.ACTIVE;

    this.ctx.game.$.messages.add({
      text: `${$.text.title} begins pursuit, leaving home (${$.ai.home?.x}, ${$.ai.home?.y}).`
    });

    if ($.pathfinder.destination && $.ai.home) {
      if (!isSamePoint($.position, $.ai.home)) {
        this.ctx.game.$.messages.add({
          text: `${$.text.title} is going home.`
        });
        $.pathfinder.destination = { x: $.ai.home.x, y: $.ai.home.y };
      }

      if (isSamePoint($.position, $.ai.home)) {
        this.ctx.game.$.messages.add({
          text: `${$.text.title} has returned home (${$.ai.home.x}, ${$.ai.home.y}).`
        });
        $.ai.state = AIState.IDLE;
      }
    }
  }

  public tick(): void {
    for (const mob of this.$.mobs) {
      if (mob.$.ai.state === AIState.IDLE) {
        const target = this.findMobTarget(mob);
        if (target) {
          this.handleActiveState(mob, target);
        }
      }
    }
  }

  public init(): void {
    for (const { $ } of this.$.mobs) {
      if (!$.ai.home) {
        $.ai.home = { x: $.position.x, y: $.position.y };
      }
    }
  }
}
