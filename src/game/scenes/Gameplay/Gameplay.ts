import type { Atlas, KeyboardInputEvent, Vector2 } from '@lib/types';
import type { ActionType } from '@utils';

import { Attack } from '@core/entities';
import { Player } from '@game/entities';
import { getPlayerPrefab } from '@game/prefabs';
import { GameplayUI } from '@game/ui';
import { Scene } from '@lib';
import { Action } from '@lib/enums';
import { renderWithContext, unrender } from '@ui/components/GameContext';
import { jsonz } from '@utils';
import { getInteractionPos, getRelativeDirection } from '@utils/geometry';
import { getSpritesheetFromAtlas } from '@utils/pixi';
import { h } from 'preact';

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
    player: this.game.ctx.$.entities(Player).persist()
  };

  protected getKeyboardAction(input: KeyboardInputEvent): ActionType | null {
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
        return { id: Action.TOGGLE_PAUSE };
      }
    }
    return null;
  }

  public render(): void {
    renderWithContext(this.game.ctx, h(GameplayUI, {}));
  }

  public stop(): void {
    unrender();
    super.stop();
  }

  public tick(): void {
    this.player ??= this.$.player.first();
    if (this.player) {
      const next = this.game.$.input.getNextEvent();
      if (!next) {
        return;
      }

      if (next.isKeyboard) {
        const action = this.getKeyboardAction(next as KeyboardInputEvent);
        if (action) {
          switch (action.id) {
            case Action.TOGGLE_PAUSE:
              this.game.pause();
              break;
            default:
              this.player.$.action.data = action;
              break;
          }
        }
      } else {
        switch (next.type) {
          case 'left-click': {
            this.player.$.action.data = {
              id: Action.COMBAT_ATTACK,
              attack: this.game.ctx.create(Attack, { use: { duration: 16 } }),
              target: getInteractionPos(this.player.$.position)
            };
            break;
          }
          case 'right-click': {
            this.player.$.action.data = {
              id: Action.SET_DESTINATION,
              target: next.local
            };
            break;
          }
          case 'mouse-move': {
            if (!this.player.$.tween.active) {
              this.player.$.position.d = getRelativeDirection(
                this.player.$.position,
                next.local
              );
            }
            break;
          }
          default:
            break;
        }
      }
    }
  }

  public async start(): Promise<void> {
    const { data, tags } = await getPlayerPrefab();
    const atlas = await (data.animation?.atlas ??
      jsonz.read<Atlas>('/static/sprites/characters/skeleton'));

    this.game.$.renderer.loadSpritesheets({
      [atlas.meta.name]: await getSpritesheetFromAtlas(atlas)
    });

    this.game.ctx.create(Player, data, tags);
  }
}
