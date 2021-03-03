import * as PIXI from 'pixi.js';
import { System } from 'tecs';
import { Sprite, Position, Renderable, Overlay } from '@ecs/components';

import { Tag } from '@utils/enums';
import { TILE_HEIGHT, TILE_WIDTH } from '@utils';
import {
  getSpritesheetFromTexture,
  getTransformFromDirection,
  toHex
} from '@utils/pixi';

import { atlas } from '../../data/atlas';

export class Renderer extends System {
  public static readonly type = 'renderer';

  protected app!: PIXI.Application;

  protected sprites: Record<string, { key: string; sprite: PIXI.Sprite }> = {};
  protected overlays: Set<PIXI.Container> = new Set();
  protected sheets!: Record<keyof typeof atlas, PIXI.Spritesheet>;

  protected containers!: {
    fg: PIXI.Container;
    ui: PIXI.Container;
  };

  protected $ = {
    removals: this.world.query.tags(Tag.TO_DESTROY).persist(),
    sprites: this.world.query
      .components(Position, Sprite)
      .some.components(Renderable)
      .persist(),
    overlays: this.world.query.components(Overlay, Position).persist()
  };

  public drawOverlays(): void {
    for (const entity of this.$.overlays) {
      const { $ } = entity;
      const { x, y } = this.world.game.$.renderer.getScreenPoint($.position);
      const container = new PIXI.Container();

      const sprites = $.overlay.tiles.map(cell => {
        const sprite = PIXI.Sprite.from(this.sheets.gui.textures[cell.texture]);
        sprite.alpha = entity.$.overlay.alpha ?? 1;
        sprite.position.set(
          cell.position.x * TILE_WIDTH,
          cell.position.y * TILE_HEIGHT
        );
        return sprite;
      });

      container.addChild(...sprites);
      container.position.set(x, y);

      this.overlays.add(container);
      this.containers.ui.addChild(container);

      entity.destroy();
    }
  }

  protected clearOverlays(): void {
    for (const overlay of this.overlays) {
      if (overlay.parent) {
        overlay.parent.removeChild(overlay);
      } else {
        this.containers.ui.removeChild(overlay);
      }
      overlay.removeChildren();
      overlay.destroy();
    }
    this.overlays.clear();
  }

  public updateSprites(): void {
    for (const { $, id } of this.$.sprites) {
      if ($.render?.dirty === false) {
        continue;
      }

      const keySprite = this.sprites[id];

      if (!keySprite) {
        continue;
      }

      if (keySprite.key !== $.sprite.key) {
        this.addSprite(id, $.sprite.key);
      }

      const point = new PIXI.Point(
        $.position.x * TILE_WIDTH,
        $.position.y * TILE_HEIGHT
      );
      const { sprite } = keySprite;
      if (!point.equals(sprite.position)) {
        sprite.position = point;
      }

      sprite.zIndex = $.position.z;
      const [scaleX, scaleY] = getTransformFromDirection($.position.d);
      if (scaleX && scaleY) {
        sprite.anchor.x = scaleX === 1 ? 0 : 1;
        sprite.scale.x = scaleX;
        sprite.scale.y = scaleY;
      }

      if ($.render) {
        const { fg } = $.render;
        // const sprite = this.sprites[id];
        fg ? (sprite.tint = toHex(fg) ?? 0xffffff) : void 0;
        $.render.dirty = false;
      } else {
        sprite.tint = $.sprite.tint
          ? toHex($.sprite.tint)
          : keySprite.sprite.tint;
      }
    }
  }

  public updateRemovals(): void {
    for (const entity of this.$.removals) {
      const s = this.sprites[entity.id];
      if (s) {
        s.sprite.destroy();
        delete this.sprites[entity.id];
        entity.destroy();
      }
    }
  }

  public tick(): void {
    this.clearOverlays();
    this.updateRemovals();
    this.drawOverlays();
    this.updateSprites();
  }

  protected addSprite(id: string, key: string): void {
    for (const name in atlas) {
      const spritesheet = this.sheets[name];
      const texture = spritesheet.textures[key];
      if (texture?.valid) {
        const next = {
          key,
          sprite: PIXI.Sprite.from(spritesheet.textures[key])
        };

        if (this.sprites[id]?.sprite) {
          this.containers.fg.removeChild(this.sprites[id].sprite);
        }

        this.containers.fg.addChild(next.sprite);
        this.sprites[id] = next;
        return;
      }
    }
  }

  // init functions can be async
  public async init(): Promise<void> {
    this.app = this.world.game.$.renderer.app;

    this.containers = {
      fg: new PIXI.Container(),
      ui: new PIXI.Container()
    };

    this.containers.fg.name = 'fg';
    this.containers.ui.name = 'ui';

    this.sheets = {};
    for (const key in atlas) {
      const value = atlas[key];
      const texture = await PIXI.Texture.fromURL(value.image);
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      this.sheets[key] = await getSpritesheetFromTexture(texture, value.atlas);
    }

    // create all sprites and add to the stage
    for (const { $, id } of this.world.query.components(Position, Sprite)) {
      this.addSprite(id, $.sprite.key);
    }

    this.containers.ui.interactive = true;
    this.containers.ui.zIndex = 10;

    this.app.stage.addChild(this.containers.fg, this.containers.ui);
  }
}
