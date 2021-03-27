import type { EntityType } from 'tecs';

import * as PIXI from 'pixi.js';
import { System } from 'tecs';
import { Sprite, Position, Renderable, Overlay } from '@ecs/components';

import { Tag } from '@enums';

import {
  TILE_HEIGHT,
  TILE_WIDTH,
  getTransformFromDirection,
  toRelative
} from '@utils';

import { atlas } from '../../assets/atlases';
import { toHex } from '@utils/colors';

async function getSpritesheetFromTexture(
  texture: PIXI.Texture,
  atlas: unknown
): Promise<PIXI.Spritesheet> {
  return new Promise(resolve => {
    const spritesheet = new PIXI.Spritesheet(texture, atlas);
    spritesheet.parse(() => resolve(spritesheet));
  });
}

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

  public updatePosition(
    entity: EntityType<[typeof Sprite, typeof Position]>
  ): void {
    const rel = toRelative(this.world.game.$.map, entity.$.position);
    const pixi = entity.$.sprite.pixi;
    if (rel && pixi) {
      const point = new PIXI.Point(rel.x * TILE_WIDTH, rel.y * TILE_HEIGHT);
      if (!point.equals(pixi.position)) {
        pixi.position = point;
      }
      pixi.zIndex = entity.$.position.z ?? 0;
    }
  }

  public updateTransform(
    entity: EntityType<[typeof Sprite, typeof Position]>
  ): void {
    const { sprite, position } = entity.$;
    if (sprite.pixi) {
      const [scaleX, scaleY] = getTransformFromDirection(position.d);
      if (scaleX && scaleY) {
        sprite.pixi.anchor.x = scaleX === 1 ? 0 : 1;
        sprite.pixi.scale.x = scaleX;
        sprite.pixi.scale.y = scaleY;
      }
    }
  }

  public updateSprites(): void {
    for (const entity of this.$.sprites) {
      if (entity.$.sprite.pixi) {
        if (entity.$.render?.dirty === false) {
          continue;
        }
      } else {
        this.addSprite(entity);
      }

      this.updatePosition(entity);
      this.updateTransform(entity);

      const sprite = entity.$.sprite;
      if (sprite.pixi) {
        // if (entity.$.render) {
        //   sprite.pixi.tint = toHex(entity.$.render.fg ?? AMBIENT_DARK);
        // } else {
        if (sprite.tint) {
          sprite.pixi.tint = toHex(sprite.tint);
        }
        // }
      }
    }
  }

  protected addSprite(
    entity: EntityType<[typeof Sprite, typeof Position]>
  ): void {
    for (const name in atlas) {
      const key = entity.$.sprite.key;
      const spritesheet = this.sheets[name];
      const texture = spritesheet.textures[key];
      if (texture?.valid) {
        const rel = toRelative(this.world.game.$.map, entity.$.position);

        if (!rel) {
          return;
        }
        entity.$.sprite.pixi ??= new PIXI.Sprite(spritesheet.textures[key]);
        entity.$.sprite.pixi.position = new PIXI.Point(
          rel.x * TILE_WIDTH,
          rel.y * TILE_HEIGHT
        );

        this.containers.fg.addChild(entity.$.sprite.pixi);
        return;
      }
    }
  }

  public updateRemovals(): void {
    for (const entity of this.$.removals) {
      const sprite = entity.$.sprite.pixi;
      if (sprite) {
        sprite.destroy();
      }
      entity.destroy();
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

    this.containers.ui.interactive = true;
    this.containers.ui.zIndex = 10;

    this.app.stage.addChild(this.containers.fg, this.containers.ui);
  }
}
