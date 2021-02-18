import { Entity } from 'tecs';
import { Game } from '../components';
import { UIMode } from '../types';

export class Core extends Entity.with(Game) {
  public setMode(mode?: UIMode): void {
    this.$.game.mode = mode ?? UIMode.DEFAULT;
  }
}
