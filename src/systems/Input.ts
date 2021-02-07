import { System } from 'tecs';
import { Core, Player } from '../entities';
import { ID, UIMode } from '../types';

interface ModeAction {
  action: ID;
  target?: string | null;
}

interface InputEvent {
  type?: string;
  key: string;
  x?: number;
  y?: number;
}

export class Input extends System {
  public static readonly type = 'input';

  public inputs: InputEvent[] = [];

  public getDialogueAction(input: string): ModeAction {
    switch (input) {
      case 'left-mouse':
      case ' ':
        return { action: ID.DIALOGUE_NEXT };
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        return { action: ID.DIALOGUE_CHOOSE, target: (+input - 1).toString() };
    }
    return { action: ID.NONE };
  }

  public getDefaultAction(input: string): ModeAction {
    switch (input) {
      case 'w': {
        return { action: ID.MOVE_UP };
      }
      case 'a': {
        return { action: ID.MOVE_LEFT };
      }
      case 'd': {
        return { action: ID.MOVE_RIGHT };
      }
      case 's': {
        return { action: ID.MOVE_DOWN };
      }
      case ' ': {
        return { action: ID.INTERACT };
      }
    }
    return { action: ID.NONE };
  }

  public tick(): void {
    const input = this.inputs.shift();

    if (!input) {
      return;
    }

    const game = this.world.query.entities(Core).first();
    const player = this.world.query.entities(Player).first();

    if (!player) {
      return;
    }

    const { action } = player.$$;

    let next;

    switch (game?.$.game.mode) {
      case UIMode.DIALOGUE:
        next = this.getDialogueAction(input.key);
        break;
      case UIMode.DEFAULT:
        next = this.getDefaultAction(input.key);
        break;
    }

    action.action = next?.action ?? ID.NONE;
    action.target = next?.target ?? null;
    action.subject = player.id;
  }

  public init(): void {
    window.addEventListener('keydown', e => {
      this.inputs.push({ key: e.key });
      // this.world.tick(0, Date.now());
    });
    window.addEventListener('click', e => {
      this.inputs.push({ key: 'left-mouse', x: e.x, y: e.y });
    });
  }
}
