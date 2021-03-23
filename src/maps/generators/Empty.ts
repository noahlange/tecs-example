import { MapBuilder } from '@lib';
import { TileType } from '@enums';

export class Builder extends MapBuilder {
  public generate(): void {
    this.map.tiles.fill(TileType.FLOOR);
    this.map.snapshot();
  }
}
