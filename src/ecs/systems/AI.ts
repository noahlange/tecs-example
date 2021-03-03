import type { EntityType } from 'tecs';
import type {
  AI as AIComponent,
  View,
  Pathfinder,
  Text,
  Faction as FactionComponent
} from '../components';
import type { Faction } from '@types';

import { System } from 'tecs';
import { AIState } from '@types';
import { isSamePoint, isWithin } from '@utils';

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

  protected factions: Map<Faction, Set<MobType>> = new Map();
  protected $ = {
    player: this.world.query.components(Playable, Position).persist(),
    mobs: this.world.query.entities(Monster).persist()
  };

  protected findMobTarget(mob: MobType): MobType | null {
    for (const [faction, members] of this.factions.entries()) {
      if (!mob.$.faction.factions.includes(faction)) {
        for (const member of members) {
          if (isWithin(member.$.position, mob.$.view.visible)) {
            return member;
          }
        }
      }
    }
    return null;
  }

  protected getMobFactions(): void {
    for (const entity of this.$.mobs) {
      for (const faction of entity.$.faction.factions) {
        this.factions.get(faction)?.add(entity);
      }
    }
  }

  protected handleActiveState(mob: MobType, target: MobType): void {
    const { $ } = mob;

    $.ai.state = AIState.ACTIVE;
    console.log(
      `${$.text.title} begins pursuit, leaving home (${$.ai.home?.x}, ${$.ai.home?.y}).`
    );

    if ($.pathfinder.destination && $.ai.home) {
      if (!isSamePoint($.position, $.ai.home)) {
        console.log(`${$.text.title} is going home.`);
        $.pathfinder.destination = { x: $.ai.home.x, y: $.ai.home.y };
      }

      if (isSamePoint($.position, $.ai.home)) {
        console.log(
          `${$.text.title} has returned home (${$.ai.home.x}, ${$.ai.home.y}).`
        );
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
    this.getMobFactions();
  }
}
