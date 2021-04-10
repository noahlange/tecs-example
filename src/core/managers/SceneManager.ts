import type { Scene } from '@lib';
import type { Game } from '../Game';

import { Manager } from '@lib';
import { GameState } from '@enums';

interface SceneConstructor<T> {
  new (scene: Game): Scene<T>;
}

export class SceneManager extends Manager {
  public state: GameState = GameState.RUNNING;
  public scene: Scene | null = null;

  protected stack: Scene[] = [];

  public push<T = {}>(Constructor: SceneConstructor<T>, props?: T): void {
    const s = new Constructor(this.game);
    this.scene = s;
    s.init?.(props);
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
