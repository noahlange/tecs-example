import type { EntityType } from 'tecs';

import * as PIXI from 'pixi.js';
import { System } from 'tecs';
import { Sprite, Position, Renderable, Overlay } from '@ecs/components';

import { Tag } from '@enums';

import {
  TILE_HEIGHT,
  TILE_WIDTH,
  getSpritesheetFromTexture,
  getTransformFromDirection,
  AMBIENT_LIGHT
} from '@utils';

import { toHex } from '@utils/colors';

import { atlas } from '../../assets/atlases';

export class Renderer extends System {
  public static readonly type = 'renderer';

  protected app!: PIXI.Application;

  protected overlays: Set<PIXI.Container> = new Set();
  protected sheets!: Record<keyof typeof atlas, PIXI.Spritesheet>;

  protected containers!: {
    fg: PIXI.Container;
    ui: PIXI.Container;
  };

  protected $ = {
    removals: this.world.query
      .tags(Tag.TO_UNRENDER)
      .components(Sprite)
      .persist(),
    sprites: this.world.query
      .components(Position, Sprite)
      .some.components(Renderable)
      .none.tags(Tag.TO_UNRENDER)
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
        sprite.alpha = entity.$.overlay.color.a ?? 1;
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
    for (const entity of this.$.sprites) {
      if (entity.$.sprite.pixi) {
        if (entity.$.render?.dirty === false) {
          continue;
        }
      }

      const { sprite, position: pos } = entity.$;

      if (!entity.$.sprite.pixi) {
        this.addSprite(entity);
      }

      const point = new PIXI.Point(pos.x * TILE_WIDTH, pos.y * TILE_HEIGHT);

      const s = sprite.pixi!;

      if (!point.equals(pos)) {
        s.position = point;
      }

      s.zIndex = pos.z;

      const [scaleX, scaleY] = getTransformFromDirection(pos.d);
      if (scaleX && scaleY) {
        s.anchor.x = scaleX === 1 ? 0 : 1;
        s.scale.x = scaleX;
        s.scale.y = scaleY;
      }

      if (entity.$.render) {
        const { fg } = entity.$.render;
        s.tint = toHex(fg ?? AMBIENT_LIGHT);
        entity.$.render.dirty = false;
      } else {
        if (sprite.tint) {
          s.tint = toHex(sprite.tint);
        }
      }
    }
  }

  public updateRemovals(): void {
    for (const entity of this.$.removals) {
      const sprite = entity.$.sprite.pixi;
      if (sprite) {
        entity.tags.remove(Tag.TO_UNRENDER);
        sprite.destroy();
      }
    }
  }

  public tick(): void {
    this.clearOverlays();
    this.updateRemovals();
    this.drawOverlays();
    this.updateSprites();
  }

  protected addSprite(entity: EntityType<[typeof Sprite]>): void {
    for (const name in atlas) {
      const key = entity.$.sprite.key;
      const spritesheet = this.sheets[name];
      const texture = spritesheet.textures[key];
      if (texture?.valid) {
        entity.$.sprite.pixi ??= PIXI.Sprite.from(spritesheet.textures[key]);
        this.containers.fg.addChild(entity.$.sprite.pixi);
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

    this.containers.fg.sortableChildren = true;
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
    for (const entity of this.$.sprites) {
      this.addSprite(entity);
    }

    this.containers.ui.interactive = true;
    this.containers.ui.zIndex = 10;

    this.app.stage.addChild(this.containers.fg, this.containers.ui);
  }
}
