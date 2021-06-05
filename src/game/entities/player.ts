import type { EntityType } from 'tecs';

import {
  Actor,
  Animated,
  Combatant,
  Faction,
  HasEquipment,
  Inventory,
  LightSource,
  Pathfinder,
  Playable,
  Position,
  Renderable,
  Sprite,
  Text,
  Tweened,
  View
} from '@core/components';
import { Stats } from '@game/components';
import { Entity } from 'tecs';

export class Player extends Entity.with(
  Combatant,
  Actor,
  Animated,
  Faction,
  Stats,
  Sprite,
  Position,
  HasEquipment,
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
    typeof Animated,
    typeof Actor,
    typeof Faction,
    typeof HasEquipment,
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
