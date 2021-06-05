import type { Game } from '@core';

export class Scene<T = {}> {
  public game: Game;

  public tick?(d: number, ts: number): Promise<void> | void;
  public start?(props?: T): Promise<void> | void;
  public render?(): void;

  public stop(): Promise<void> | void {
    this.game.$.scenes.pop();
  }

  public constructor(game: Game) {
    this.game = game;
  }
}
