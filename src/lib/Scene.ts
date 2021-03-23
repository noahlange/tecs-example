import type { Game } from '@core/Game';

export abstract class Scene<T = {}> {
  protected game: Game;

  public abstract tick(d: number, ts: number): void;

  public init(props?: T): void {}

  public end(): void {
    this.game.$.scenes.pop();
  }

  public constructor(game: Game) {
    this.game = game;
  }
}
