import type { Game } from '../core/Game';

declare module 'tecs' {
  export interface Context {
    game: Game;
  }
}
