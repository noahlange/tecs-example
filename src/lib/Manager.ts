import type { Game } from '@core/Game';

export class Manager {
  protected game: Game;

  public init?(): void;
  public toJSON?(): object;

  public constructor(game: Game) {
    this.game = game;
  }
}
