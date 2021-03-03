import type { EntityType } from 'tecs';
import type { RGBColor } from '@types';

import { Entity } from 'tecs';

import {
  Actor,
  Sprite,
  Position,
  Playable,
  LightSource,
  Renderable,
  Stats,
  Text,
  View,
  Inventory,
  Faction,
  Pathfinder,
  Combatant,
  Equipped
} from '../../components';

export class Player extends Entity.with(
  Combatant,
  Actor,
  Faction,
  Stats,
  Sprite,
  Position,
  Equipped,
  Inventory,
  LightSource,
  Playable,
  Pathfinder,
  Renderable,
  Text,
  View
) {
  public static readonly data = {
    text: { title: 'Player' },
    light: { color: [255, 255, 0] as RGBColor },
    sprite: { key: 'player_01' },
    view: { range: 10 }
  };
}

export type PlayerEntity = EntityType<
  [
    typeof Actor,
    typeof Faction,
    typeof Equipped,
    typeof Sprite,
    typeof Inventory,
    typeof LightSource,
    typeof Playable,
    typeof Position,
    typeof Renderable,
    typeof Pathfinder,
    typeof Stats,
    typeof Text,
    typeof View,
    typeof Combatant
  ]
>;
