import * as ROT from 'rot-js';
import type { DisplayOptions } from 'rot-js/lib/display/types';
import { System } from 'tecs';

import { Playable, Position, Renderable, Glyph } from '../components';
import { HEIGHT, WIDTH, TILE } from '../utils';
import { glyphs, tileMap } from '../utils/tiles';

export class Renderer extends System {
  public static readonly type = 'renderer';

  public ui!: ROT.Display;
  public display!: ROT.Display;

  public tick(): void {
    const query = this.world.query
      .changed(Glyph, Renderable, Position)
      .some(Playable)
      .get();

    const results = query.sort((a, b) =>
      a.$.player ? 1 : b.$.player ? -1 : 0
    );

    for (const { $ } of results) {
      const fg = $.render?.active ? $.render.fg : $.glyph.fg;
      const bg = $.render?.active ? $.render.bg : $.glyph.bg;
      // draw glyph to display
      this.display.draw(
        $.position.x,
        $.position.y,
        $.glyph.text,
        fg ? ROT.Color.toRGB(fg) : null,
        bg ? ROT.Color.toRGB(bg) : null
      );
    }
  }

  public async init(): Promise<void> {
    const tiles = document.createElement('img');
    tiles.src = glyphs;
    // tileset loaded
    await new Promise(resolve => (tiles.onload = resolve));

    const settings: Partial<DisplayOptions> = {
      layout: 'tile-gl',
      bg: 'transparent',
      width: WIDTH,
      height: HEIGHT,
      tileWidth: TILE,
      tileHeight: TILE,
      tileSet: tiles,
      tileColorize: true,
      tileMap
    };

    this.display = new ROT.Display(settings);
    const container = this.display.getContainer();
    if (container) {
      document.getElementById('root')?.appendChild(container);
    }
  }
}
