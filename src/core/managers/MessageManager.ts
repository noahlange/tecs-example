import type { GameMessage } from '@types';
import { Manager } from '@lib';

export class MessageManager extends Manager {
  protected messages: Set<GameMessage> = new Set();

  public clear(): void {
    this.messages.clear();
  }

  public remove(type?: number): void {
    for (const m of this.messages) {
      if (!type || m.type === type) {
        this.messages.delete(m);
      }
    }
  }

  public get(): GameMessage[] {
    return Array.from(this.messages.values());
  }

  public add(message: GameMessage): void {
    this.messages.add(message);
  }

  public *[Symbol.iterator](): Iterator<GameMessage> {
    yield* this.messages;
  }
}
