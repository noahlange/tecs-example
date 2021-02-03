import { System } from 'tecs';
import { Player } from '../entities';
import { ID } from '../types';

export class Input extends System {
  public static readonly type = 'input';

  public inputs: string[] = [];

  public tick(): void {
    const input = this.inputs.shift();

    if (!input) {
      return;
    }

    const player = this.world.query.ofType(Player).first();

    if (!player) {
      return;
    }

    const { action } = player.$$;
    let next = ID.NONE;

    switch (input) {
      case 'w':
        next = ID.MOVE_UP;
        break;
      case 'a':
        next = ID.MOVE_LEFT;
        break;
      case 'd':
        next = ID.MOVE_RIGHT;
        break;
      case 's':
        next = ID.MOVE_DOWN;
        break;
      case ' ':
        next = ID.INTERACT;
        break;
    }

    action.action = next;
    action.subject = player.id;
  }

  public init(): void {
    window.addEventListener('keydown', e => {
      this.inputs.push(e.key);
    });
  }
}
