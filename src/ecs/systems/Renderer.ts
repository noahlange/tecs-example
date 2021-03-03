import type { Point } from '@types';
import * as PIXI from 'pixi.js';
import type { EntityType } from 'tecs';
import { System } from 'tecs';
import {
  Sprite,
  Pathfinder,
  Position,
  Renderable,
  Stats,
  Playable
} from '../components';

import { Tag } from '@utils/enums';
import { isSamePoint, TILE_HEIGHT, TILE_WIDTH, T } from '@utils';
import {
  getSpritesheetFromTexture,
  getTransformFromDirection,
  toHex
} from '@utils/pixi';

import { atlas } from '../../data/atlas';
import { HealthBar } from '@lib';

interface HealthBarData {
  bar: HealthBar;
  added: boolean;
  container: PIXI.Container;
}
export class Renderer extends System {
  public static readonly type = 'renderer';

  protected sprites: Record<string, { key: string; sprite: PIXI.Sprite }> = {};

  protected app!: PIXI.Application;
  protected paths: Record<
    string,
    { target: Point; sprites: PIXI.Sprite[] }
  > = {};

  protected sheets: Record<string, PIXI.Spritesheet> = {};
  protected bars: Record<string, HealthBarData> = {};

  protected containers!: {
    fg: PIXI.Container;
    ui: PIXI.Container;
  };

  protected $ = {
    removals: this.world.query.tags(Tag.TO_UNRENDER).persist(),
    paths: this.world.query.components(Pathfinder).persist(),
    stats: this.world.query
      .components(Position, Renderable, Stats)
      .none.components(Playable)
      .persist(),
    sprites: this.world.query
      .components(Position, Sprite)
      .some.components(Renderable)
      .persist()
  };

  public renderHP(
    entity: EntityType<[typeof Position]>,
    health: HealthBarData
  ): void {
    const container = health.container;
    container.removeChildren();

    const sprites = health.bar.sprites.map(sprite =>
      PIXI.Sprite.from(this.sheets.gui.textures[sprite])
    );

    if (sprites.length) {
      let x = -(sprites.length * TILE_WIDTH - TILE_WIDTH) / 2;

      for (const sprite of sprites) {
        sprite.position.x = x;
        sprite.position.y = -16;
        x += 16;
      }

      container.addChild(...sprites);
      container.name = 'health';
    }

    if (!health.added) {
      health.added = true;
      this.containers.ui.addChild(container);
    }

    const { x, y } = this.world.game.$.renderer.getScreenPoint(
      entity.$.position
    );
    container.position.x = x;
    container.position.y = y;
  }

  public drawHealth(): void {
    for (const entity of this.$.stats) {
      const { hp, hpMax } = entity.$.stats;

      const health = (this.bars[entity.id] ??= {
        added: false,
        bar: new HealthBar(hpMax),
        container: new PIXI.Container()
      });

      health.bar.calculate(hp);
      this.renderHP(entity, health);
    }
  }

  public drawPaths(): void {
    const ids = [];

    for (const { $, id } of this.$.paths) {
      if (!$.pathfinder.destination || !$.pathfinder.path.length) {
        continue;
      }

      ids.push(id);
      const renderPath = this.paths[id] ?? {
        target: $.pathfinder.destination,
        sprites: []
      };

      if ($.pathfinder.isVisible) {
        if (
          !renderPath.sprites.length ||
          !isSamePoint(renderPath.target, $.pathfinder.destination)
        ) {
          for (const item of renderPath.sprites) {
            item.destroy();
          }

          renderPath.sprites = $.pathfinder.path.map((point, i, path) => {
            const { x, y } = this.world.game.$.renderer.getScreenPoint(point);
            const sprite = PIXI.Sprite.from(
              this.sheets.sprites.textures[T.PATH_DOT]
            );

            sprite.position.x = x;
            sprite.position.y = y;
            sprite.tint = 0xffffff;
            sprite.alpha = 0.5 - i / path.length / 2;

            return sprite;
          });

          this.containers.ui.addChild(...renderPath.sprites);
        }

        this.paths[id] = renderPath;
      }
    }

    for (const id in this.paths) {
      if (!ids.includes(id)) {
        for (const item of this.paths[id].sprites) {
          item.destroy();
        }
        delete this.paths[id];
      }
    }
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
        // sprite.bg.position = point;
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
        entity.tags.remove(Tag.TO_UNRENDER);
      }
    }
  }

  public tick(): void {
    this.drawHealth();
    this.updateRemovals();
    this.updateSprites();
    this.drawPaths();
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

    this.app.stage.addChild(this.containers.fg, this.containers.ui);
  }
}
