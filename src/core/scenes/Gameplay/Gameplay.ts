import type { ActionType } from '@utils';
import { AMBIENT_DARK } from '@utils';
import type { KeyboardInputEvent, MouseInputEvent, Vector2 } from '@types';

import { h, render } from 'preact';
import { Scene } from '@lib';

import { Attack, Cell, Player } from '@ecs/entities';
import { attacks, items, player, armor, weapons } from '@ecs/prefabs';
import type { InventoryItem } from '@ecs/entities/types';

import { Tag, TileType } from '@enums';
import { Action } from '@utils';

import { GameplayUI } from './GameplayUI';
import { Inventory } from '../Inventory';

const deltaKey: Record<string, Vector2> = {
  w: { x: 0, y: -1 },
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 }
};

export class Gameplay extends Scene {
  protected player!: Player;
  protected point: Vector2 | null = null;
  protected attack: InstanceType<typeof Attack> | null = null;

  protected getAttackAction(): ActionType {
    if (this.point) {
      const data = attacks[0];
      this.attack = this.game.ecs.create(Attack, {
        ...data,
        equip: { owner: this.player! },
        position: this.player.$.position
      });
      return { id: Action.COMBAT_ATTACK_PAUSED, attack: this.attack };
    }
    return { id: Action.NONE };
  }

  protected cancelAttack(): void {
    if (this.attack) {
      this.attack.tags.add(Tag.TO_UNRENDER);
      this.attack.destroy();
      this.attack = null;
    }
  }

  protected getMouseAction(input: MouseInputEvent): ActionType {
    switch (input.type) {
      case 'left-click': {
        const attack = this.attack;
        if (attack) {
          this.cancelAttack();
          return {
            id: Action.COMBAT_ATTACK,
            target: attack.$.position,
            attack: attack
          };
        }
        return { id: Action.NONE };
      }
      case 'right-click': {
        return {
          id: Action.COMBAT_DEFEND,
          target: { x: input.x, y: input.y }
        };
      }
      case 'mouse-move': {
        this.point = { x: input.x, y: input.y };
        break;
      }
    }
    return { id: Action.NONE };
  }

  protected getKeyboardAction(input: KeyboardInputEvent): ActionType {
    switch (input.key) {
      case 'i': {
        this.game.$.scenes.push(Inventory);
        break;
      }
      case '1': {
        if (this.attack) {
          this.cancelAttack();
        } else {
          return this.getAttackAction();
        }
        break;
      }
      case 'w':
      case 's':
      case 'a':
      case 'd': {
        const delta = deltaKey[input.key];
        if (this.attack) {
          this.attack.$.position.x += delta.x;
          this.attack.$.position.y += delta.y;
          break;
        } else {
          return { id: Action.MOVE, delta };
        }
      }
      case ' ': {
        // we'll define the target later on
        return { id: Action.INTERACT, target: null };
      }
    }
    return { id: Action.NONE };
  }

  protected addTiles(): void {
    const collisions = this.game.$.map.collisions;
    for (const [point, tile] of this.game.$.map.entries()) {
      const isWall = tile === TileType.WALL;
      collisions.set(point, !isWall, !isWall);
      const key = isWall ? 'wall_01_ew' : 'floor_02_06';
      this.game.ecs.create(Cell, {
        position: point,
        collision: { passable: !isWall, allowLOS: !isWall },
        sprite: { key, tint: AMBIENT_DARK },
        render: { dirty: true }
      });
    }
  }

  protected addItems(): void {
    for (const item of [...items, ...armor, ...weapons]) {
      const { x, y } = this.game.$.map.getSpawn();
      this.player.$.inventory.items.push(
        this.game.ecs.create(
          item.entity,
          { ...item.data, position: { x, y, z: 5 } },
          item.tags
        ) as InventoryItem
      );
    }
  }

  protected addPlayer(): void {
    this.player = this.game.ecs.create(Player, {
      ...player.data,
      position: {
        ...player.data.position,
        ...this.game.$.map.getSpawn()
      }
    });
  }

  public tick(): void {
    this.player ??= this.game.ecs.query.entities(Player).find();
    const next = this.game.$.commands.getNextEvent();
    if (next) {
      this.player.$.action.data = next.isKeyboard
        ? this.getKeyboardAction(next)
        : this.getMouseAction(next);
    }

    render(
      h(GameplayUI, {
        player: this.player,
        log: this.game.$.messages.get(),
        state: this.game.state,
        chunk: this.game.$.map.chunk
      }),
      document.getElementById('ui')!
    );
  }

  public init(): void {
    this.addTiles();
    this.addPlayer();
    this.addItems();
    this.game.emit('initMap');
  }
}
