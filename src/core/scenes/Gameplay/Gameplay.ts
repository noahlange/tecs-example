import type { ActionType } from '@utils';
import type { KeyboardInputEvent, MouseInputEvent, Point } from '@types';

import { h, render } from 'preact';
import { Action } from '@utils';
import { Attack, Player } from '@ecs/entities';
import { Scene } from '@lib';

import { GameplayUI } from './GameplayUI';
import { Inventory } from '../Inventory';
import { attacks } from '../../../data';
import { Tag } from '@utils/enums';

export class Gameplay extends Scene {
  protected player!: Player;
  protected point: Point | null = null;
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
      this.attack.tags.add(Tag.TO_DESTROY);
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
        const delta: Point = (() => {
          switch (input.key) {
            case 'w':
              return { x: 0, y: -1 };
            case 'a':
              return { x: -1, y: 0 };
            case 's':
              return { x: 0, y: 1 };
            case 'd':
              return { x: 1, y: 0 };
          }
        })();

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
        state: this.game.state
      }),
      document.getElementById('ui')!
    );
  }
}
