import type { InventoryItem } from '@core/entities/types';

import { Equippable } from '@core/components';
import { Player } from '@core/entities';
import { Scene, UIList } from '@lib';
import { ItemType, Tag } from '@lib/enums';
import { Action } from '@lib/enums';
import { InventoryUI } from '@ui/scenes/Inventory';
import { h, render } from 'preact';

export class Inventory extends Scene {
  protected yList = new UIList<InventoryItem>();
  protected xList = new UIList<ItemType | null>();
  protected dirty: boolean = true;
  protected player!: Player;

  protected handleInput(): void {
    const next = this.game.$.input.getNextEvent();
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
  }

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
    this.dirty = false;
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
      if (target.has(Equippable) && target.is(Tag.IS_EQUIPPABLE)) {
        this.player.$.action.data = {
          id: target.$.equip.isEquipped
            ? Action.ITEM_UNEQUIP
            : Action.ITEM_EQUIP,
          actor: this.player,
          target
        };
      } else if (target.is(Tag.IS_CONSUMABLE)) {
        this.player.$.action.data = {
          id: Action.ITEM_USE,
          target,
          actor: this.player
        };
      }
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
    this.handleInput();
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
