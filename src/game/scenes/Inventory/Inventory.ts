import type { InventoryItem } from '@game/entities';

import { IsEquipment } from '@core/components';
import { Player } from '@game/entities';
import { ItemType } from '@game/enums';
import { InventoryUI } from '@game/ui/Inventory';
import { Scene, UIList } from '@lib';
import { Tag } from '@lib/enums';
import { Action } from '@lib/enums';
import { renderWithContext, unrender } from '@ui/components/GameContext';
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
          this.stop();
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
      if (target.has(IsEquipment) && target.is(Tag.IS_EQUIPPABLE)) {
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

  public render(): void {
    if (this.dirty) {
      this.refresh();
    }

    renderWithContext(
      this.game.ctx,
      h(InventoryUI, {
        items: this.yList.items,
        index: this.yList.index,
        selected: this.yList.selected,
        type: this.xList.selected
      })
    );
  }

  public stop(): void {
    unrender();
    super.stop();
  }

  public tick(): void {
    const wasDirty = this.dirty;
    this.dirty = false;
    this.handleInput();
    if (wasDirty) {
      this.refresh();
    }
  }

  public start(): void {
    this.xList.setItems([
      null,
      ItemType.WEAPON,
      ItemType.ARMOR,
      ItemType.CONSUMABLE,
      ItemType.MAGIC,
      ItemType.MISC
    ]);
    this.player = this.game.ctx.$.entities(Player).find();
  }
}
