import type { GameMessage } from '../../lib/types';

import { Manager } from '@lib';

export class MessageManager extends Manager {
  protected messages: Set<GameMessage> = new Set();

  public clear(): void {
    this.messages.clear();
  }

  public remove(type?: number): void {
    if (type) {
      for (const m of this.messages) {
        if (m.type === type) {
          this.messages.delete(m);
        }
      }
    } else this.clear();
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
