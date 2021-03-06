import type { Game } from '@core';

export class Scene<T = {}> {
  public game: Game;

  public tick?(d: number, ts: number): void;
  public start?(props?: T): void;
  public render?(): void;

  public stop(): void {
    this.game.$.scenes.pop();
  }

  public constructor(game: Game) {
    this.game = game;
  }
}
