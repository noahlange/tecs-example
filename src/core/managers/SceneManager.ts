import type { Scene } from '@lib';
import type { Game } from '../Game';

import { Manager } from '@lib';
import { GameState } from '@enums';

interface SceneConstructor<T> {
  new (scene: Game): Scene<T>;
}

export class SceneManager extends Manager {
  public state: GameState = GameState.RUNNING;

  protected stack: Scene[] = [];
  public scene!: Scene;

  public push<T = {}>(scene: SceneConstructor<T>, props?: T): void {
    const s = (this.scene = new scene(this.game));
    s.init(props);
    this.stack.push(s);
  }

  public pop(): void {
    this.stack.pop();
    const scene = this.stack[this.stack.length - 1];
    if (scene) {
      this.scene = scene;
    }
  }
}
