import type { Game } from '@core';

export class Manager {
  protected game: Game;

  public start?(): Promise<void>;
  public toJSON?(): object;

  public constructor(game: Game) {
    this.game = game;
  }
}
