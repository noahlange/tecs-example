import type { Vector2 } from '../../lib/types';

enum TiledPropertyType {
  BOOLEAN = 'bool',
  COLOR = 'color',
  STRING = 'string',
  FLOAT = 'float',
  INTEGER = 'int'
}

export type TiledTileProperty =
  | {
      name: string;
      type: TiledPropertyType.BOOLEAN;
      value: boolean;
    }
  | {
      name: string;
      type: TiledPropertyType.COLOR | TiledPropertyType.STRING;
      value: string;
    }
  | {
      name: string;
      type: TiledPropertyType.FLOAT | TiledPropertyType.INTEGER;
      value: number;
    };

export interface TiledTile {
  id: number;
  properties?: TiledTileProperty[];
}

export interface WangTile {
  tileid: number;
  wangid: number[];
}

export interface WangSet {
  colors: { color: string; name: string; probability: number; tile: number }[];
  name: string;
  tile: number;
  type: string;
  wangtiles: WangTile[];
}

export interface TiledTilesetReference {
  firstgid: number;
  source: string;
}

export interface TiledTileset {
  columns: number;
  grid: {
    height: number;
    orientation: string;
    width: number;
  };
  image: string;
  imageheight: number;
  imagewidth: number;
  tilewidth: number;
  tileheight: number;
  tilecount: number;
  tiledversion: string;
  margin: number;
  tileoffset: Vector2;
  name: string;
  wangsets: WangSet[];
  tiles?: TiledTile[];
}

export interface TiledLayer {
  // in CSV export mode
  data: number[];
  height: number;
  width: number;
  name: string;
  opacity: number;
  type: string;
  visible: boolean;
  x: number;
  y: number;
}

export interface TiledMap {
  height: number;
  width: number;
  layers: TiledLayer[];
  tilesets: TiledTilesetReference[];
  nextobjectid: number;
  orientation: string;
  properties?: Record<string, number | string | boolean | undefined>;
  renderorder: string;
  tileheight: number;
  tilewidth: number;
  version: string | number;
}
