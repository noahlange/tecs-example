import { MapBuilder } from '@lib';
import { Collision, TileType } from '@lib/enums';

export class Builder extends MapBuilder {
  public generate(): void {
    this.map.tiles.fill({
      collision: Collision.NONE,
      spriteKey: TileType.FLOOR
    });
    this.map.snapshot();
  }
}
