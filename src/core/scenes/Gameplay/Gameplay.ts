import type { ActionType } from '@utils';
import type { KeyboardInputEvent, MouseInputEvent } from '@types';

import { h, render } from 'preact';
import { Action } from '@utils';
import { Player } from '@ecs/entities';
import { Scene } from '@lib';

import { GameplayUI } from './GameplayUI';
import { Inventory } from '../Inventory';
import { Entity } from 'tecs';
import { AreaOfEffect, Equippable } from '@ecs/components';
import { DamageType } from '@utils/enums';

const Attack = Entity.with(AreaOfEffect, Equippable);

export class Gameplay extends Scene {
  protected player!: Player;

  protected getMouseAction(input: MouseInputEvent): ActionType {
    switch (input.type) {
      case 'left-click': {
        return {
          id: Action.COMBAT_ATTACK,
          target: { x: input.x, y: input.y },
          attack: this.game.ecs.create(Attack, {
            aoe: { range: 2 },
            equip: {
              damage: [{ type: DamageType.BLUNT, value: '2d6' }]
            }
          })
        };
      }
      case 'right-click': {
        return {
          id: Action.COMBAT_DEFEND,
          target: { x: input.x, y: input.y }
        };
      }
    }
    return {
      id: Action.NONE
    };
  }

  protected getKeyboardAction(input: KeyboardInputEvent): ActionType {
    switch (input.key) {
      case 'i': {
        this.game.$.scenes.push(Inventory);
        break;
      }
      case 'w': {
        return { id: Action.MOVE, delta: { x: 0, y: -1 } };
      }
      case 's': {
        return { id: Action.MOVE, delta: { x: 0, y: 1 } };
      }
      case 'a': {
        return { id: Action.MOVE, delta: { x: -1, y: 0 } };
      }
      case 'd': {
        return { id: Action.MOVE, delta: { x: 1, y: 0 } };
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
      h(GameplayUI, { player: this.player, log: this.game.$.messages.get() }),
      document.getElementById('ui')!
    );
  }
}
