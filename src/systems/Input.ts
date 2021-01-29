import { System } from 'tecs';
import { Playable } from '../components';
import { Action } from '../components/Action';
import { ID } from '../types';

export class Input extends System {
  public static readonly type = 'input';

  public inputs: string[] = [];

  public tick(): void {
    const input = this.inputs.shift();
    const player = this.world.query.changed(Playable, Action).first();

    if (input && player) {
      let action = ID.NONE;

      switch (input) {
        case 'w':
          action = ID.MOVE_UP;
          break;
        case 'a':
          action = ID.MOVE_LEFT;
          break;
        case 'd':
          action = ID.MOVE_RIGHT;
          break;
        case 's':
          action = ID.MOVE_DOWN;
          break;
        case ' ':
          action = ID.INTERACT;
      }

      player.$$.action.action = action;
      player.$$.action.subject = player.id;
    }
  }

  public init(): void {
    // currently using user input to advance "the clock"
    window.addEventListener('keydown', e => {
      this.inputs.push(e.key);
      this.world.tick(0, Date.now());
    });
  }
}
