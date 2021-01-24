import * as PIXI from 'pixi.js';
import { Position, Sprite } from '../components';

import { System } from 'tecs';
import { HEIGHT, WIDTH } from '../utils';

export class Renderer extends System {
  public static readonly type = 'renderer';

  public app!: PIXI.Application;
  public sprites: Record<string, PIXI.Sprite> = {};

  public tick(): void {
    for (const { $ } of this.world.query.with(Sprite, Position)) {
      const { sprite, position } = $;
      if (!(sprite.id in this.sprites)) {
        this.addChild(sprite);
      }
      const pixi = this.sprites[sprite.id];
      pixi.position = new PIXI.Point(position.x, position.y);
      pixi.rotation = position.r;
    }
  }

  public init(): void {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.app = new PIXI.Application({
      width: WIDTH,
      height: HEIGHT,
      antialias: false,
      transparent: true
    });
    this.app.ticker.add(this.world.tick.bind(this.world));
    document.getElementById('root')?.appendChild(this.app.view);
  }

  protected addChild = (sprite: Sprite): void => {
    const pixi = (this.sprites[sprite.id] ??= PIXI.Sprite.from(sprite.image));
    pixi.anchor.set(0.5);
    this.app.stage.addChild(pixi);
  };
}
