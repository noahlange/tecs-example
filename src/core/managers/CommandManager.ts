import type { AnyInputEvent } from '@types';
import { Manager } from '@lib';

export class CommandManager extends Manager {
  protected commands: any[] = [];
  protected events: AnyInputEvent[] = [];

  public onInputEvent(e: AnyInputEvent): void {
    this.events.push(e);
  }

  public getNextEvent(): AnyInputEvent | undefined {
    return this.events.shift();
  }
}
