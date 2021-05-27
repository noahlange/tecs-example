import type { KeyboardInputEvent, Vector2 } from '@lib/types';
import type { ActionType } from '@utils';

import { Player } from '@core/entities';
import { Scene } from '@lib';
import { Action } from '@lib/enums';
import { GameplayUI } from '@ui/scenes';
import { getRelativeDirection } from '@utils/geometry';
import { getSpritesheetFromAtlas } from '@utils/pixi';
import { h, render } from 'preact';

import atlas from '../../../../static/sprites/Medieval_PB_Premade_Male_3_Mastersheet.json';
import { Inventory } from '..';

const deltaKey: Record<string, Vector2> = {
  w: { x: 0, y: -1 },
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 }
};

export class Gameplay extends Scene {
  protected player: Player | null = null;
  protected point: Vector2 | null = null;

  protected $ = {
    player: this.game.ecs.query.entities(Player).persist()
  };

  protected getKeyboardAction(input: KeyboardInputEvent): ActionType {
    switch (input.key) {
      case 'w':
      case 's':
      case 'a':
      case 'd': {
        const delta = deltaKey[input.key];
        return { id: Action.MOVE, delta };
      }
      case 'i': {
        this.game.$.scenes.push(Inventory);
        return { id: Action.NONE };
      }
      case ' ': {
        // we'll define the target later on
        return { id: Action.INTERACT, target: null };
      }
    }
    return { id: Action.NONE };
  }

  public render(): void {
    if (this.player) {
      render(
        h(GameplayUI, {
          player: this.player,
          area: this.game.$.map.world,
          state: this.game.state
        }),
        document.getElementById('ui')!
      );
    }
  }

  public tick(): void {
    this.player ??= this.$.player.first();
    if (this.player) {
      const next = this.game.$.input.getNextEvent();
      if (next) {
        if (next.isKeyboard) {
          this.player.$.action.data = this.getKeyboardAction(
            next as KeyboardInputEvent
          );
        } else {
          switch (next.type) {
            case 'left-click': {
              this.player.$.action.data = {
                id: Action.SET_DESTINATION,
                target: next.local
              };
              break;
            }
            case 'mouse-move': {
              this.player.$.position.d = getRelativeDirection(
                this.player.$.position,
                next.local
              );
              break;
            }
            default:
              break;
          }
        }
      }
    }
  }

  public async init(): Promise<void> {
    const data = await getSpritesheetFromAtlas(atlas);
    this.game.$.renderer.loadSpritesheets({ [atlas.meta.name]: data });
  }
}
