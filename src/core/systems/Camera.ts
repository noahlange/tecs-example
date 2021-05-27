import type { Container } from '@pixi/display';
import type { Vector2 } from 'malwoden';

import { Position } from '@core/components';
import { Player } from '@core/entities';
import { Tag } from '@lib/enums';
import { System } from 'tecs';

import { Gameplay } from '../../core/scenes/Gameplay';

export class Camera extends System {
  public static readonly type = 'camera';

  protected $ = {
    player: this.ctx.$.entities(Player).persist(),
    camera: this.ctx.$.tags(Tag.IS_CAMERA).components(Position).persist()
  };

  protected player: Player | null = null;
  protected target: Vector2 | null = null;
  protected stage: Container | null = null;

  public tick(): void {
    if (this.ctx.game.scene instanceof Gameplay) {
      this.player ??= this.$.player.first();
      const thing = this.stage?.getChildByName?.('fg');

      if (this.player && thing) {
        // const screen = this.ctx.game.$.renderer.getScreenPoint(
        //   this.player.$.position
        // );
        const pixi = this.player.$.sprite.pixi;
        if (pixi) {
          this.ctx.game.$.renderer.viewport.follow(pixi);
        }

        // if (!this.target) {
        //   this.camera.effect(new PanTo(thing, screen.x, screen.y, 0));
        //   this.target = screen;
        // }

        // if (!isSamePoint(screen, this.target)) {
        //   this.target = screen;
        //   this.camera.effect(new PanTo(thing, screen.x, screen.y, 1250));
        //   console.log(screen, this.target);
        // }

        // this.ctx.game.$.renderer.follow(this.player);
        // const area = this.ctx.game.$.map.world;
        // const [next] = pos.chunk;
        // if (next.x !== area.x || next.y !== area.y) {
        //   // @ts-ignore: @todo fix
        //   area.center = next;
        // }
      }
    } else {
      const camera = this.$.camera.first();
      if (camera) {
        // this.ctx.game.$.renderer.follow(camera);
      }
    }
  }

  public init(): void {
    const app = this.ctx.game.$.renderer.app;

    this.stage = app.stage;
  }
}
