import type { AnyInputEvent } from '@lib/types';
import type { ResultNode } from 'bondage';

import { Player } from '@core/entities';
import { Scene } from '@lib';
import { DialogueUI } from '@ui/scenes/Dialogue';
import { dialogue } from '@utils';
import { OptionsResult, Runner } from 'bondage';
import { h, render } from 'preact';

export class Dialogue extends Scene {
  protected player!: Player;
  protected runner: Runner | null = null;
  protected run: Iterator<ResultNode> | null = null;
  protected pending: OptionsResult | null = null;
  protected done: boolean = false;

  protected text: string = '';
  protected options: string[] = [];

  public end(): void {
    this.run = null;
    this.done = true;
    super.end();
  }

  protected start(file: string, start?: string | null): void {
    const content = dialogue[file];
    if (file && this.runner) {
      this.runner.load(content);
      this.run = this.runner.run(start ?? 'start');
    }
  }

  protected getAction(input: AnyInputEvent): void {
    if (input.isKeyboard) {
      switch (input.key) {
        case ' ':
          if (!this.pending) {
            this.next();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.choose(+input.key - 1);
          break;
      }
    } else if (input.name === 'left-click') {
      this.next();
    }
  }

  protected choose(index: number): void {
    this.pending?.select(index);
    this.pending = null;
    this.next();
  }

  protected next(): void {
    const next = this.run?.next();
    if (next?.done) {
      this.end();
    } else if (next) {
      const result = next.value;
      this.text = result.text ?? this.text;
      if (result instanceof OptionsResult) {
        this.pending = result;
        this.options = result.options;
      } else {
        this.pending = null;
        this.options = [];
      }
    }
  }

  public tick(): void {
    this.player ??= this.game.ctx.$.entities(Player).find();
    const next = this.game.$.input.getNextEvent();

    if (next) {
      this.getAction(next);
    }

    render(
      h(DialogueUI, {
        onSelectOption: this.choose.bind(this),
        options: this.options,
        text: this.text
      }),
      document.getElementById('ui')!
    );
  }

  public init(): void {
    this.runner = new Runner();
    this.start('dialogue');
    this.next();
  }
}
