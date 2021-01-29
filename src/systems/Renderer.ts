import * as ROT from 'rot-js';
import { System } from 'tecs';

import { Playable, Position, Renderable, Glyph } from '../components';
import { HEIGHT, WIDTH, glyphs } from '../utils';

const TILE = 8;
const tileAt = (x: number, y: number): [number, number] => [x * TILE, y * TILE];

export class Renderer extends System {
  public static readonly type = 'renderer';

  public display!: ROT.Display;

  public tick(): void {
    const query = this.world.query
      .changed(Glyph, Renderable, Position)
      .some(Playable);

    const results = query
      .all()
      .sort((a, b) => (a.$.player ? 1 : b.$.player ? -1 : 0));

    for (const { $ } of results) {
      const fg = $.render.active ? $.render.fg : $.glyph.fg;
      const bg = $.render.active ? $.render.bg : $.glyph.bg;
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

    await new Promise(resolve => (tiles.onload = resolve));

    this.display = new ROT.Display({
      layout: 'tile-gl',
      bg: 'transparent',
      tileWidth: TILE,
      tileHeight: TILE,
      tileSet: tiles,
      tileColorize: true,
      tileMap: {
        '#': tileAt(12, 0),
        '.': tileAt(0, 0),
        '@': tileAt(0, 4),
        '-': tileAt(13, 2),
        '/': tileAt(15, 2)
      },
      width: WIDTH,
      height: HEIGHT
    });

    const container = this.display.getContainer();
    if (container) {
      document.getElementById('root')?.appendChild(container);
    }
  }
}
