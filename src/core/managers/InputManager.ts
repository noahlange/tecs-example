import type {
  AnyInputEvent,
  KeyboardInputEvent,
  MouseInputEvent
} from '../../lib/types';
import type * as PIXI from 'pixi.js';

import { Manager } from '@lib';
import { debounce } from 'ts-debounce';

/**
 * Standardize input events, send to command manager.
 */
export class InputManager extends Manager {
  protected x: number = 0;
  protected y: number = 0;

  protected commands: any[] = [];
  protected events: AnyInputEvent[] = [];

  public onInputEvent(e: AnyInputEvent): void {
    this.events.push(e);
  }

  public getNextEvent(): AnyInputEvent | null {
    return this.events.shift() ?? null;
  }

  protected toMouseInputEvent(e: PIXI.InteractionEvent): MouseInputEvent {
    const { x, y } = this.game.$.renderer.getWorldPoint(e.data.global);
    return {
      name: e.type,
      type:
        e.type === 'mousemove'
          ? 'mouse-move'
          : e.data.button === 2
          ? 'right-click'
          : 'left-click',
      x: x,
      y: y,
      isKeyboard: false
    };
  }

  protected toKeyboardInputEvent(e: KeyboardEvent): KeyboardInputEvent {
    return {
      name: e.type,
      key: e.key,
      isKeyboard: true,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey
    };
  }

  protected handle = {
    onMouseMove: debounce((e: PIXI.InteractionEvent) => {
      // this.onInputEvent(this.toMouseInputEvent(e));
    }, 64),
    onClick: (e: PIXI.InteractionEvent) => {
      // this.onInputEvent(this.toMouseInputEvent(e));
    },
    onKeyDown: (e: KeyboardEvent) => {
      this.events.push(this.toKeyboardInputEvent(e));
      this.game.ecs.tick(0, Date.now());
    }
  };

  public init(): void {
    const view = this.game.$.renderer.app.stage;
    view.interactive = true;
    view.on('pointermove', this.handle.onMouseMove);
    this.game.$.renderer.app.stage.addListener(
      'pointerdown',
      this.handle.onClick
    );
    window.document.addEventListener('keydown', this.handle.onKeyDown);
  }
}
