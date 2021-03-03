import { Entity } from 'tecs';
import {
  Actor,
  AI,
  Collision,
  Sprite,
  Faction,
  Interactive,
  Pathfinder,
  Position,
  Renderable,
  Stats,
  Text,
  View,
  Combatant,
  Equipped
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
    stats: { hp: 25, hpMax: 25 },
    collision: { allowLOS: true, passable: false },
    view: { range: 5 }
  };
}
