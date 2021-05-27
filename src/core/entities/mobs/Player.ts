import type { EntityType } from 'tecs';

import { Entity } from 'tecs';

import {
  Actor,
  Animated,
  Combatant,
  Equipped,
  Faction,
  Inventory,
  LightSource,
  Pathfinder,
  Playable,
  Position,
  Renderable,
  Sprite,
  Stats,
  Text,
  Tweened,
  View
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
  View,
  Animated,
  Tweened
) {}

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
