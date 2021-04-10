import type { Game } from '@core/Game';

export class Scene<T = {}> {
  public game: Game;

  public tick?(d: number, ts: number): void;
  public init?(props?: T): void;

  public end(): void {
    this.game.$.scenes.pop();
  }

  public constructor(game: Game) {
    this.game = game;
  }
}
