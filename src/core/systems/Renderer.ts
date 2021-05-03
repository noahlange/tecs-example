import type { Render } from '@core/managers';
import type { EntityType } from 'tecs';

import { Overlay, Position, Renderable, Sprite } from '@core/components';
import { Tag } from '@lib/enums';
import { AMBIENT_DARK, RGB, TILE_HEIGHT, TILE_WIDTH } from '@utils';
import { getTransformFromDirection } from '@utils/geometry';
import * as PIXI from 'pixi.js';
import { System } from 'tecs';

type Spriteable = EntityType<
  [typeof Sprite, typeof Position],
  [typeof Renderable]
>;

export class Renderer extends System {
  public static readonly type = 'renderer';

  protected app!: PIXI.Application;
  protected overlays: Set<PIXI.Container> = new Set();
  protected renderer!: Render;

  protected containers!: {
    fg: PIXI.Container;
    ui: PIXI.Container;
  };

  protected $ = {
    removals: this.world.query
      .tags(Tag.TO_DESTROY)
      .components(Sprite)
      .persist(),
    sprites: this.world.query
      .components(Position, Sprite)
      .some.components(Renderable)
      .none.tags(Tag.TO_DESTROY)
      .persist(),
    overlays: this.world.query.components(Overlay, Position).persist()
  };

  public drawOverlays(): void {
    for (const entity of this.$.overlays) {
      const { $ } = entity;
      const { x, y } = this.world.game.$.renderer.getScreenPoint($.position);
      const container = new PIXI.Container();

      const sprites = $.overlay.tiles.map(cell => {
        const sprite = PIXI.Sprite.from(
          this.renderer.sheets.gui.textures[cell.texture]
        );
        sprite.alpha = entity.$.overlay.color.a ?? 1;
        sprite.position.set(cell.position.x, cell.position.y);
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

  public updatePosition({ $ }: Spriteable): void {
    const screen = this.world.game.$.renderer.getScreenPoint($.position);
    if ($.sprite.pixi) {
      const pixi = $.sprite.pixi;
      const point = new PIXI.Point(screen.x, screen.y);
      const zIndex = ($.position.z ?? 0) + screen.z;
      if (!point.equals(pixi.position)) {
        pixi.position.copyFrom(point);
      }
      if (pixi.zIndex !== zIndex) {
        pixi.zIndex = zIndex;
      }
    }
  }

  public updateTransform({ $ }: Spriteable): void {
    const scale = getTransformFromDirection($.position.d);
    if ($.sprite.pixi && scale) {
      $.sprite.pixi.anchor.x = scale.x === 1 ? 0 : 1;
      $.sprite.pixi.scale.x = scale.x;
      $.sprite.pixi.scale.y = scale.y;
    }
  }

  public updateTint(entity: Spriteable): void {
    const { pixi, tint } = entity.$.sprite;
    if (pixi) {
      if (entity.has(Renderable)) {
        pixi.tint = RGB.toHex(entity.$.render.fg ?? AMBIENT_DARK);
        entity.$.render.dirty = false;
      } else if (tint) {
        const hex = RGB.toHex(tint);
        if (hex !== pixi.tint) {
          pixi.tint = hex;
        }
      }
    }
  }

  public updateSprites(): void {
    for (const entity of this.$.sprites) {
      // @todo - support key changes
      const { render, sprite } = entity.$;

      if (!sprite.pixi && sprite.key) {
        this.addSprite(entity);
      }

      this.updatePosition(entity);
      this.updateTransform(entity);

      if (render?.dirty) {
        this.updateTint(entity);
      }
    }
  }

  protected addSprite(entity: Spriteable): void {
    const { sprite, position } = entity.$;
    const [name, key] = sprite.key.split('.');
    const texture = this.renderer.getTexture(name, key);

    if (texture?.valid) {
      const rel = this.world.game.$.renderer.getScreenPoint(position);
      const pixi = new PIXI.Sprite(texture);
      pixi.zIndex = position.z + rel.z;
      pixi.position.set(rel.x * TILE_WIDTH, rel.y * TILE_HEIGHT);
      this.containers.fg.addChild(pixi);
      entity.$.sprite.pixi = pixi;
    }
  }

  public updateRemovals(): void {
    for (const entity of this.$.removals) {
      if (entity.tags.has(Tag.TO_DESTROY)) {
        entity.$.sprite.pixi?.destroy();
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

  // init functions can be async
  public async init(): Promise<void> {
    this.renderer = this.world.game.$.renderer;
    this.app = this.renderer.app;

    const fg = new PIXI.Container();
    fg.name = 'fg';
    fg.sortableChildren = true;

    const ui = new PIXI.Container();
    ui.name = 'ui';
    ui.interactive = true;
    ui.zIndex = 10;

    this.containers = { fg, ui };
    this.app.stage.addChild(this.containers.fg, this.containers.ui);
  }
}
