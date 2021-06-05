import {
  Actor,
  AI,
  Collision,
  Combatant,
  Faction,
  HasEquipment,
  Interactive,
  Pathfinder,
  Position,
  Renderable,
  Sprite,
  Text,
  View
} from '@core/components';
import { Stats } from '@game/components';
import { HealthBar } from '@game/lib';
import { Collision as Collisions } from '@lib/enums';
import { Entity } from 'tecs';

export class Monster extends Entity.with(
  AI,
  Actor,
  Sprite,
  Position,
  Renderable,
  Text,
  Collision,
  Stats,
  Faction,
  Interactive,
  Pathfinder,
  View,
  HasEquipment,
  Combatant
) {
  public static readonly data = {
    stats: { health: new HealthBar(25) },
    collision: { value: Collisions.OBSTACLE },
    view: { range: 5 }
  };
}
