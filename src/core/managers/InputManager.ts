import { Manager } from '@lib';
import type { KeyboardInputEvent, MouseInputEvent } from '@types';
import { debounce } from 'ts-debounce';

/**
 * Standardize input events, send to command manager.
 */
export class InputManager extends Manager {
  protected x: number = 0;
  protected y: number = 0;

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
    onMoveEvent: debounce((e: PIXI.InteractionEvent) => {
      this.game.$.commands.onInputEvent(this.toMouseInputEvent(e));
    }, 64),
    onClickEvent: (e: PIXI.InteractionEvent) => {
      this.game.$.commands.onInputEvent(this.toMouseInputEvent(e));
    },
    onKeyDown: (e: KeyboardEvent) => {
      this.game.$.commands.onInputEvent(this.toKeyboardInputEvent(e));
    }
  };

  public init(): void {
    const view = this.game.$.renderer.app.stage;
    view.interactive = true;
    view.on('pointermove', this.handle.onMoveEvent);
    this.game.$.renderer.app.stage.addListener(
      'pointerdown',
      this.handle.onClickEvent
    );
    window.document.addEventListener('keydown', this.handle.onKeyDown);
  }
}
