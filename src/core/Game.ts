import type { Scene } from '@lib';
import type { Events } from '@lib/types';

import { ECS } from '@core/ECS';
import { GameState } from '@lib/enums';
import { update } from '@tweenjs/tween.js';
import { createNanoEvents } from 'nanoevents';

import * as Managers from './managers';

interface GameManagers {
  renderer: Managers.Render;
  input: Managers.Input;
  scenes: Managers.Scene;
  messages: Managers.Message;
  save: Managers.Save;
  map: Managers.Map;
}

export class Game {
  public ecs = new ECS();

  public $: GameManagers;

  protected events = createNanoEvents<Events>();

  public on<E extends keyof Events>(event: E, callback: Events[E]): void {
    this.events.on(event, callback);
  }

  public once<E extends keyof Events>(event: E, callback: Events[E]): void {
    const unregister = this.events.on(event, (...args: any[]) => {
      (callback as (...args: any) => any)(...args);
      unregister();
    });
  }

  public emit<E extends keyof Events>(
    event: E,
    ...data: Parameters<Events[E]>
  ): void {
    this.events.emit(event, ...data);
  }

  public async start(save?: any): Promise<void> {
    this.ecs.game = this;
    // init systems...
    for (const key of Object.keys(this.$) as (keyof GameManagers)[]) {
      this.$[key].init?.();
    }
    // boot managers
    await this.ecs.start();
    if (save) {
      // populate ECS with load save data.
      this.ecs.load(save);
    }
    // attach pixi ticker
    this.$.renderer.app.ticker.add(() => {
      update();
      this.ecs.tick(this.$.renderer.app.ticker.deltaMS, Date.now());
    });
  }

  public set state(state: GameState) {
    this.$.scenes.state = state;
  }

  public get state(): GameState {
    return this.$.scenes.state;
  }

  public get paused(): boolean {
    return this.$.scenes.state === GameState.PAUSED;
  }

  public get scene(): Scene | null {
    return this.$.scenes.scene;
  }

  public run(state?: GameState): void {
    this.$.scenes.state = state ?? GameState.RUNNING;
  }

  public pause(): void {
    this.$.scenes.state = GameState.PAUSED;
  }

  public log(text: string): void {
    this.$.messages.add({ text });
  }

  public constructor() {
    this.$ = {
      renderer: new Managers.Render(this),
      scenes: new Managers.Scene(this),
      messages: new Managers.Message(this),
      input: new Managers.Input(this),
      save: new Managers.Save(this),
      map: new Managers.Map(this)
    };
  }
}
