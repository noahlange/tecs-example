import { UIList, Scene } from '@lib';
import { h, render } from 'preact';
import { MenuUI } from './MenuUI';

enum MenuOption {
  NEW_GAME = 0,
  LOAD_GAME = 1,
  OPTIONS = 2
}

export class Menu extends Scene {
  protected list = new UIList<MenuOption>();

  public end(): void {
    return;
  }

  public tick(): void {
    const next = this.game.$.input.getNextEvent();
    if (next?.isKeyboard) {
      switch (next.key) {
        case 'w':
          this.list.up();
          break;
        case 's':
          this.list.down();
          break;
      }
    }

    render(h(MenuUI, {}), document.getElementById('ui')!);
  }

  public init(): void {
    this.list.setItems([
      MenuOption.NEW_GAME,
      MenuOption.LOAD_GAME,
      MenuOption.OPTIONS
    ]);
  }
}
