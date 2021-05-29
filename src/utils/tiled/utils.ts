import type { TiledMap, TiledTileset } from './types';

import { Projection } from '@lib/enums';

export function getProjectionFromTiledMap(map: TiledMap): Projection {
  switch (map.orientation) {
    case 'isometric':
      return Projection.ISOMETRIC;
    case 'orthographic':
    default:
      return Projection.ORTHOGRAPHIC;
  }
}

export function getProjectionFromTileset(map: TiledTileset): Projection {
  switch (map.grid?.orientation) {
    case 'isometric':
      return Projection.ISOMETRIC;
    case 'orthographic':
    default:
      return Projection.ORTHOGRAPHIC;
  }
}
