import type { Render } from '@core/managers';
import type { EntityType } from 'tecs';

import {
  Actor,
  Overlay,
  Position,
  Renderable,
  Sprite,
  Tweened
} from '@core/components';
import { Tag } from '@lib/enums';
import { Tween } from '@tweenjs/tween.js';
import { AMBIENT_DARK, RGB, TILE_HEIGHT, TILE_WIDTH } from '@utils';
import { isSamePoint } from '@utils/geometry';
import * as PIXI from 'pixi.js';
import { System } from 'tecs';

type Spriteable = EntityType<
  [typeof Sprite, typeof Position],
  [typeof Renderable, typeof Tweened]
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
      .some.components(Actor, Renderable, Tweened)
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

  public tweenPosition(entity: Spriteable): void {
    if (entity.has(Tweened, Actor)) {
      const { tween, sprite, position } = entity.$;
      const screen = this.world.game.$.renderer.getScreenPoint(position);
      if (sprite.pixi && !tween.tween) {
        tween.tween = new Tween(sprite.pixi.position)
          .to(screen, 500)
          .onUpdate(position => {
            sprite.pixi?.position.set(position.x, position.y);
            tween.active = true;
          })
          .onComplete(() => {
            tween.tween = null;
            tween.active = false;
          })
          .start();
      }
    }
  }

  public updatePosition(entity: Spriteable): void {
    const { position, sprite } = entity.$;
    const screen = this.world.game.$.renderer.getScreenPoint(position);
    const pixi = sprite.pixi;
    if (pixi) {
      const zIndex = (position.z ?? 0) + screen.z;
      // @todo tweening
      if (!isSamePoint(screen, pixi.position)) {
        if (entity.has(Tweened)) {
          this.tweenPosition(entity);
        } else {
          pixi.position.set(screen.x, screen.y);
        }
      }
      if (pixi.zIndex !== zIndex) {
        pixi.zIndex = zIndex;
      }
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
      // @todo - handle sprite key changes
      const { render, sprite } = entity.$;

      if (!sprite.pixi && sprite.key) {
        this.addSprite(entity);
      } else if (sprite.changed) {
        this.updateSprite(entity);
      }

      this.updatePosition(entity);

      if (render?.dirty) {
        this.updateTint(entity);
      }
    }
  }

  protected updateSprite(entity: Spriteable): void {
    const { sprite } = entity.$;

    if (sprite.pixi && sprite.key) {
      const [name, key] = sprite.key.split('.');
      const texture = this.renderer.getTexture(name, key);
      if (texture?.valid) {
        sprite.pixi.texture = texture;
        sprite.key = [name, key].join('.');
      }
    }
  }

  protected addSprite(entity: Spriteable): void {
    const { sprite, position } = entity.$;
    if (sprite.key) {
      const [name, key] = sprite.key.split('.');
      const texture = this.renderer.getTexture(name, key);
      if (texture?.valid) {
        const rel = this.world.game.$.renderer.getScreenPoint(position);
        const pixi = new PIXI.Sprite(texture);
        pixi.zIndex = position.z + rel.z;
        pixi.position.set(rel.x * TILE_WIDTH, rel.y * TILE_HEIGHT);
        this.containers.fg.addChild(pixi);
        entity.$.sprite.pixi = pixi;
        pixi.name = entity.id;
        pixi.anchor.set(sprite.pivot.x, sprite.pivot.y);
        sprite.key = [name, key].join('.');
      }
    }
  }

  public updateRemovals(): void {
    for (const entity of this.$.removals) {
      if (entity.tags.has(Tag.TO_DESTROY)) {
        const pixi = entity.$.sprite.pixi;
        if (pixi) {
          pixi.parent?.removeChild(pixi);
        }
        entity.destroy();
      }
    }
  }

  public tick(): void {
    // this.clearOverlays();
    // this.updateRemovals();
    // this.drawOverlays();
    this.updateSprites();

    // this.viewport.moveCenter(x, y);
  }

  // init functions can be async
  public async init(): Promise<void> {
    this.renderer = this.world.game.$.renderer;
    this.app = this.renderer.app;
    this.app.stage.interactive = true;

    const fg = new PIXI.Container();
    fg.name = 'fg';
    fg.sortableChildren = true;
    fg.interactive = true;
    fg.zIndex = 1;

    const ui = new PIXI.Container();
    ui.name = 'ui';
    ui.interactive = true;
    ui.zIndex = 10;

    this.containers = { fg, ui };

    this.app.stage.sortableChildren = true;
    this.app.stage.addChild(this.containers.ui);

    this.renderer.viewport.addChild(this.containers.fg);
  }
}
