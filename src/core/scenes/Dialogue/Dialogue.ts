import { h, render } from 'preact';

import { OptionsResult, Runner, TextResult } from 'bondage';
import type { ResultNode } from 'bondage';

import { Player } from '@ecs/entities';
import { Scene } from '@lib';
import type { AnyInputEvent } from '@types';
import { dialogue } from '@utils';

import { DialogueUI } from './DialogueUI';

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
      this.run = this.runner.run(start ?? 'Start');
    }
  }

  protected getAction(input: AnyInputEvent): void {
    if (input.isKeyboard) {
      switch (input.key) {
        case ' ':
          this.next();
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
          this.choose(+input.key);
          break;
      }
    } else if (input.name === 'pointerdown') {
      this.next();
    }
  }

  protected choose(index: number): void {
    this.pending?.select(index);
    this.pending = null;
  }

  protected next(): void {
    const next = this.run?.next();
    if (next?.done) {
      this.end();
    } else if (next) {
      const result = next.value;
      if (result instanceof TextResult) {
        this.text = result.text;
      }
      if (result instanceof OptionsResult) {
        this.text = result.text;
        this.options = result.options;
      }
    }
  }

  public tick(): void {
    this.player ??= this.game.ecs.query.entities(Player).find();
    const next = this.game.$.commands.getNextEvent();

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
  }
}
