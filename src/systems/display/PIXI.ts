import * as PIXI from 'pixi.js';
import { System } from 'tecs';
import { Glyph, Interactive, Position, Renderable } from '../../components';
import { Player } from '../../entities';
import { TILE } from '../../utils';
import { getSpritesheetFromTexture, toHex } from '../../utils/pixi';
import { glyphs, T, tileAtlas } from '../../utils/tiles';

export class Renderer extends System {
  public static readonly type = 'renderer';

  protected sprites: Record<
    string,
    { glyph: string; fg: PIXI.Sprite; bg: PIXI.Sprite }
  > = {};
  public app!: PIXI.Application;

  public atlas: Record<string, any> = {};
  public spritesheet!: PIXI.Spritesheet;

  public tick(delta: number, time?: number): void {
    // find all updated entities with Sprite and Position components

    const query = this.world.query.all
      .components(Position, Glyph)
      .any.changed.components(Position, Glyph)
      .get();

    for (const { $, id } of query) {
      const glyph = $.glyph.text;
      const child = this.sprites[id];
      if (child.glyph !== glyph) {
        child.glyph = glyph;
        child.fg.texture = this.spritesheet.textures[glyph];
      }
      const point = new PIXI.Point($.position.x * TILE, $.position.y * TILE);
      child.fg.position = point;
      child.bg.position = point;
    }

    const q2 = this.world.query.all
      .components(Renderable, Glyph)
      .any.changed.components(Renderable, Glyph)
      .some.components(Interactive)
      .get();

    const results = q2.sort((a, b) => {
      const [ai, bi] = [a.$.interact ?? 0, b.$.interact ?? 0];
      return (ai && 1) - (bi && 1);
    });

    for (const { id, $ } of results) {
      const fg = $.render?.active ? $.render.fg : $.glyph.fg;
      const bg = $.render?.active ? $.render.bg : $.glyph.bg;
      const sprite = this.sprites[id];

      fg ? (sprite.fg.tint = toHex(fg) ?? 0xffffff) : void 0;
      bg ? (sprite.bg.tint = toHex(bg) ?? 0xffffff) : void 0;
    }

    for (const { id } of this.world.query.entities(Player)) {
      if (this.sprites[id]) {
        this.sprites[id].fg.tint = 0xffffff;
      }
    }
  }

  // init functions can be async
  public async init(): Promise<void> {
    this.app = new PIXI.Application({
      width: 480,
      height: 320,
      resolution: 2,
      antialias: false,
      transparent: true
    });

    const fg = new PIXI.Container();
    const bg = new PIXI.Container();

    const texture = PIXI.Texture.from(glyphs);
    this.spritesheet = await getSpritesheetFromTexture(texture, tileAtlas);
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const q = this.world.query.components(Position, Glyph).get();
    // create all sprites and add to the stage
    for (const { $, id } of q) {
      const sprite = (this.sprites[id] = {
        glyph: $.glyph.text,
        bg: PIXI.Sprite.from(this.spritesheet.textures[T.BLANK]),
        fg: PIXI.Sprite.from(this.spritesheet.textures[$.glyph.text])
      });

      bg.addChild(sprite.bg);
      fg.addChild(sprite.fg);
    }

    this.app.stage.addChild(bg);
    this.app.stage.addChild(fg);

    // bind the world's "tick" method to PIXI's ticker
    this.app.ticker.add(this.world.tick.bind(this.world));
    // mount stage to DOM
    document.getElementById('root')?.appendChild(this.app.view);
  }
}
