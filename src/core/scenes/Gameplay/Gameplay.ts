import type { ActionType } from '@utils';
import type { KeyboardInputEvent, Vector2 } from '@types';
import type { Area } from '@lib';

import { Scene } from '@lib';

import { Player } from '@ecs/entities';
import { player } from '@ecs/prefabs';

import { Action } from '@utils';
import { GameplayUI } from './GameplayUI';
import { h, render } from 'preact';

const deltaKey: Record<string, Vector2> = {
  w: { x: 0, y: -1 },
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 }
};

export class Gameplay extends Scene {
  protected player!: Player;
  protected point: Vector2 | null = null;

  protected getKeyboardAction(input: KeyboardInputEvent): ActionType {
    switch (input.key) {
      case 'w':
      case 's':
      case 'a':
      case 'd': {
        const delta = deltaKey[input.key];
        return { id: Action.MOVE, delta };
      }
      case ' ': {
        // we'll define the target later on
        return { id: Action.INTERACT, target: null };
      }
    }
    return { id: Action.NONE };
  }

  protected addPlayer(area: Area): void {
    console.log('add');
    this.player = this.game.ecs.create(Player, {
      ...player.data,
      position: {
        ...player.data.position,
        ...area.getSpawn({ x: 0, y: 0 })
      }
    });
  }

  public tick(): void {
    if (this.player) {
      const next = this.game.$.commands.getNextEvent();
      if (next?.isKeyboard) {
        this.player.$.action.data = this.getKeyboardAction(
          next as KeyboardInputEvent
        );
      }

      render(
        h(GameplayUI, {
          player: this.player,
          area: this.game.$.map.area,
          state: this.game.state
        }),
        document.getElementById('ui')!
      );
    }
  }

  public init(): void {
    this.game.once('init.area', area => this.addPlayer(area));
    this.game.$.map.area.center = { x: 0, y: 0 };
  }
}
