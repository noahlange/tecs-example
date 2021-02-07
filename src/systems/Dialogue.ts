import { System } from 'tecs';
import { OptionsResult, Runner, TextResult } from 'bondage';
import type { ResultNode } from 'bondage';

import dialogue from '../utils/dialogue';
import { Core, UIMessage, UIOption } from '../entities';
import { Action, Talk } from '../components';
import { ID, UIMode } from '../types';

export class Dialogue extends System {
  public static readonly type = 'system';

  protected runner: Runner | null = null;
  protected run: Iterator<ResultNode> | null = null;
  protected pending: OptionsResult | null = null;
  protected done: boolean = false;

  public start(file: string, start?: string | null): void {
    const content = dialogue[file];
    if (file && this.runner) {
      this.runner.load(content);
      this.run = this.runner.run(start ?? 'Start');
      const game = this.world.query.entities(Core).first();
      game?.setMode(UIMode.DIALOGUE);
    }
  }

  public end(): void {
    this.run = null;
    this.done = true;
    const game = this.world.query.entities(Core).first();
    game?.setMode(UIMode.DEFAULT);
  }

  public next(): void {
    const next = this.run?.next();
    if (next?.done) {
      this.end();
    } else if (next) {
      const result = next.value;
      if (result instanceof TextResult) {
        this.world.create(UIMessage, {
          text: { value: result.text, title: '' }
        });
      }
      if (result instanceof OptionsResult) {
        this.pending = result;
        this.world.create(UIMessage, { text: { value: result.text } });
        for (const value of result.options) {
          this.world.create(UIOption, { text: { value } });
        }
      }
    }
  }

  public tick(): void {
    const { $ } = this.world.query.changed.components(Talk).first() ?? {
      $: null
    };
    if ($?.talk.active && $?.talk.file) {
      if (!this.run) {
        this.start($.talk.file, $.talk.start);
        this.next();
      }
    }

    if (this.run) {
      for (const { $$ } of this.world.query.components(Action)) {
        const actions = $$.action;

        switch (actions.action) {
          case ID.DIALOGUE_CHOOSE: {
            if (actions.target) {
              this.pending?.select(+actions.target);
              this.pending = null;
              actions.action = ID.DIALOGUE_NEXT;
            }
            continue;
          }
          case ID.DIALOGUE_NEXT: {
            if (!this.pending) {
              this.next();
              actions.action = ID.NONE;
            }
          }
        }
      }
    }
  }

  public init(): void {
    this.runner = new Runner();
  }
}
