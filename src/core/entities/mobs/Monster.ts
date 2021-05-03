import { HealthBar } from '@lib';
import { Collision as Collisions } from '@lib/enums';
import { Entity } from 'tecs';

import {
  Actor,
  AI,
  Collision,
  Combatant,
  Equipped,
  Faction,
  Interactive,
  Pathfinder,
  Position,
  Renderable,
  Sprite,
  Stats,
  Text,
  View
} from '../../components';

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
  Equipped,
  Combatant
) {
  public static readonly data = {
    stats: { health: new HealthBar(25) },
    collision: { value: Collisions.OBSTACLE },
    view: { range: 5 }
  };
}
