import type { AnyInputEvent, KeyboardInputEvent } from '@lib/types';
import type { Vector2 } from 'malwoden';
import type * as PIXI from 'pixi.js';
import type { Viewport } from 'pixi-viewport';

import { Manager } from '@lib';

interface ViewportClickedEvent {
  event: PIXI.InteractionEvent;
  world: PIXI.ObservablePoint;
  viewport: Viewport;
}

/**
 * Standardize input events, send to command manager.
 */
export class InputManager extends Manager {
  protected x: number = 0;
  protected y: number = 0;

  public mouse: Vector2 | null = null;

  protected commands: any[] = [];
  protected events: AnyInputEvent[] = [];

  public onInputEvent(e: AnyInputEvent): void {
    this.events.push(e);
  }

  // @todo: handle input event pressure
  public getNextEvent(): AnyInputEvent | null {
    const e = this.events.shift() ?? null;
    this.events = [];
    return e;
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
    onMouseMove: (e: PIXI.InteractionEvent) => {
      const screen = this.game.$.renderer.viewport.toWorld(e.data.global);
      this.onInputEvent({
        name: 'mousemove',
        type: 'mouse-move',
        local: this.game.$.renderer.getWorldPoint(screen),
        screen,
        isKeyboard: false
      });
    },
    onClick: (e: ViewportClickedEvent) => {
      this.onInputEvent({
        name: e.event.type,
        type: e.event.data.button === 2 ? 'right-click' : 'left-click',
        local: this.game.$.renderer.getWorldPoint(e.world),
        screen: e.world,
        isKeyboard: false
      });
    },
    onKeyDown: (e: KeyboardEvent) => {
      this.events.push(this.toKeyboardInputEvent(e));
      this.game.ctx.tick(0, Date.now());
    }
  };

  public async start(): Promise<void> {
    const stage = this.game.$.renderer.app.stage;

    stage.name = 'stage';
    stage.interactive = true;
    stage.on('pointermove', this.handle.onMouseMove);

    this.game.$.renderer.viewport.on('clicked', this.handle.onClick);
    window.document.addEventListener('keydown', this.handle.onKeyDown);
  }
}
