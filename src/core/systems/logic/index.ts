import { conditional, sequence } from 'tecs';

import { AISystem } from './AISystem';
import { CollisionSystem } from './CollisionSystem';
import { CombatSystem } from './CombatSystem';
import { InteractSystem } from './InteractSystem';
import { InventorySystem } from './InventorySystem';
import { ItemSystem } from './ItemSystem';
import { MovementSystem } from './MovementSystem';
import { PathfindingSystem } from './PathfindingSystem';

export default conditional(
  ctx => !ctx.game.paused,
  sequence(
    AISystem,
    PathfindingSystem,
    CollisionSystem,
    MovementSystem,
    InteractSystem,
    InventorySystem,
    CombatSystem,
    ItemSystem
  )
);
