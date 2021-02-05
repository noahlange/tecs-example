import { h, createContext, render } from 'preact';
import { System } from 'tecs';

import { Game, Text, UI as UIText } from '../components';
import { Player, UIMessage, UIOption } from '../entities';
import type { UITextMessage } from '../types';
import UIMount from '../ui/UIMount';
import { ID, UIMode } from '../types';

export const UIContext = createContext<{
  items: UITextMessage[];
  options: UITextMessage[];
}>({
  items: [],
  options: []
});

export class UI extends System {
  public static readonly type = 'ui';

  public mount!: HTMLElement;
  public items: UITextMessage[] = [];
  public options: UITextMessage[] = [];
  public selected: string | null = null;
  public mode: UIMode | null = null;
  public dirty: boolean = false;

  public onSelectOption = (index: number): void => {
    this.selected = '' + index;
    this.options = [];
    this.dirty = true;
  };

  public handlePlayerDialogue(player: Player): void {
    const { $$ } = player;
    if (this.selected) {
      $$.action.action = ID.DIALOGUE_CHOOSE;
      $$.action.target = this.selected;
      this.selected = null;
    } else if ($$.action.action === ID.DIALOGUE_CHOOSE) {
      if ($$.action.target !== null) {
        this.options = [];
        this.dirty = true;
      }
    }
  }

  public tick(): void {
    const updates = this.world.query.created(Text, UIText).get();
    const player = this.world.query.ofType(Player).first();
    const game = this.world.query.changed(Game).first();

    if (player) {
      this.handlePlayerDialogue(player);
    }
    if (game) {
      this.dirty = true;
    }

    for (const update of updates) {
      const { $ } = update;
      if (update instanceof UIOption) {
        this.options.push({ title: '', text: $.text.value });
      } else {
        if (update instanceof UIMessage) {
          this.options = [];
        }
        if ($.text.value) {
          this.items.push({ title: '', text: $.text.value });
        }
      }
      if (this.items.length > 5) {
        this.items.shift();
      }
      update.destroy();
    }

    if (updates.length || this.dirty) {
      this.render(game?.$.game.mode);
    }
  }

  public render(mode?: UIMode): void {
    this.mode = mode ?? this.mode;
    render(
      h(UIMount, {
        mode: this.mode as UIMode.DIALOGUE & UIMode.DEFAULT,
        item: this.items[this.items.length - 1],
        items: this.items,
        options: this.options,
        onSelectOption: i => this.onSelectOption(i)
      }),
      this.mount
    );
    this.dirty = false;
  }

  public init(): void {
    this.mount = document.getElementById('ui')!;
    this.render(UIMode.DEFAULT);
  }
}
