import type { InventoryItem } from '@ecs/entities/types';
import { h, render } from 'preact';

import { Scene, UIList } from '@lib';
import { ItemType } from '@types';
import { Player } from '@ecs/entities';
import { Action } from '@utils';

import { InventoryUI } from './InventoryUI';

export class Inventory extends Scene {
  protected yList = new UIList<InventoryItem>();
  protected xList = new UIList<ItemType | null>();
  protected dirty: boolean = true;
  protected player!: Player;

  protected refresh(): void {
    const items = this.player.$.inventory.items
      .filter(item => {
        return (
          this.xList.selected === null ||
          item.$.item.type === this.xList.selected
        );
      })
      .sort((a, b) => a.$.text.title.localeCompare(b.$.text.title));

    this.yList.setItems(items);
  }

  protected left(): void {
    this.xList.up();
    this.dirty = true;
  }

  protected right(): void {
    this.xList.down();
    this.dirty = true;
  }

  protected up(): void {
    this.yList.up();
  }

  protected down(): void {
    this.yList.down();
  }

  protected use(): void {
    const target = this.yList.selected;
    if (target) {
      this.player.$.action.data = {
        id: Action.ITEM_USE,
        target,
        actor: this.player
      };
      this.dirty = true;
    }
  }

  protected render(): void {
    if (this.dirty) {
      this.refresh();
    }
    render(
      h(InventoryUI, {
        items: this.yList.items,
        index: this.yList.index,
        selected: this.yList.selected,
        type: this.xList.selected
      }),
      document.getElementById('ui')!
    );
  }

  public end(): void {
    render(null, document.getElementById('ui')!);
    super.end();
  }

  public tick(): void {
    const wasDirty = this.dirty;
    this.dirty = false;
    const next = this.game.$.commands.getNextEvent();

    if (next?.isKeyboard) {
      switch (next.key) {
        case 'i':
          this.end();
          break;
        case ' ':
          this.use();
          break;
        case 'w':
          this.up();
          break;
        case 'a':
          this.left();
          break;
        case 's':
          this.down();
          break;
        case 'd':
          this.right();
          break;
      }
    }
    if (wasDirty) {
      this.refresh();
    }
    this.render();
  }

  public init(): void {
    this.xList.setItems([
      null,
      ItemType.WEAPON,
      ItemType.ARMOR,
      ItemType.CONSUMABLE,
      ItemType.MAGIC,
      ItemType.MISC
    ]);
    this.player = this.game.ecs.query.entities(Player).find();
  }
}
