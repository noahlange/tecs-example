import type { Scene } from '@lib';

import * as Managers from './managers';
import { ECS } from '../ecs/ECS';
import type { GameState } from '../types';

interface GameManagers {
  renderer: Managers.Render;
  commands: Managers.Command;
  input: Managers.Input;
  scenes: Managers.Scene;
  messages: Managers.Message;
  map: Managers.Map;
}

export class Game {
  public ecs = new ECS();

  public $: GameManagers;

  public async start(): Promise<void> {
    this.ecs.game = this;
    for (const key of Object.keys(this.$) as (keyof GameManagers)[]) {
      this.$[key].init?.();
    }
    await this.ecs.start();
    this.$.renderer.app.ticker.add(this.ecs.tick.bind(this.ecs));
  }

  public set state(state: GameState) {
    this.$.scenes.state = state;
  }

  public get state(): GameState {
    return this.$.scenes.state;
  }

  public get scene(): Scene {
    return this.$.scenes.scene;
  }

  public log(text: string): void {
    this.$.messages.add({ text });
  }

  public constructor() {
    this.$ = {
      renderer: new Managers.Render(this),
      commands: new Managers.Command(this),
      scenes: new Managers.Scene(this),
      messages: new Managers.Message(this),
      input: new Managers.Input(this),
      map: new Managers.Map(this)
    };
  }
}
