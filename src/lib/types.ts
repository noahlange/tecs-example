import type { DamageType, EffectType, Tag } from './enums';
import type { ChunkMap, StaticMap } from '@core/maps';
import type * as PIXI from 'pixi.js';
import type { DataType, EntityClass } from 'tecs';

declare global {
  interface Window {
    PIXI: typeof PIXI;
  }
}

export interface Events {
  'init.map.chunks': (area: ChunkMap) => void;
  'init.map.static': (map: StaticMap) => void;
  'game.save': () => void;
  'game.load': () => void;
}

export interface Tile<T extends object = {}> {
  id?: string;
  x: number;
  y: number;
  data: T;
}

export interface TileProperty {
  name: string;
  type: string;
  value: number | string | boolean;
}

export interface AtlasFrame {
  id?: string;
  frame: { x: number; y: number; w: number; h: number };
  properties?: { [key: string]: number | boolean | string | undefined };
}

export interface Atlas {
  meta: {
    name: string;
    image: string;
    scale: string;
    size: {
      w: number;
      h: number;
    };
  };
  frames: Record<string, AtlasFrame>;
  animations: Record<string, string[]>;
}

export interface Prefab<T extends EntityClass = EntityClass> {
  id: string;
  entity: T;
  tags: Tag[];
  data: DataType<T>;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 extends Vector2 {
  z: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface DamageDefinition {
  value: string;
  type: DamageType;
}

export interface BaseInputEvent {
  name: string;
  isKeyboard: boolean;
}

export interface MouseInputEvent extends BaseInputEvent {
  local: Vector2;
  screen: Vector2;
  type: string;
  isKeyboard: false;
}

export interface KeyboardInputEvent extends BaseInputEvent {
  isKeyboard: true;
  key: string;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;
}

export type AnyInputEvent = MouseInputEvent | KeyboardInputEvent;

export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface InputEvent {
  type: 'pointer' | 'keyboard';
  key: string;
  point?: Vector2;
}

export interface GameMessage {
  type?: number;
  text: string;
}

export interface UITextMessage {
  text: string;
  title: string;
}

export interface ItemEffect {
  type: EffectType;
  description: string;
  value: number;
  duration: number;
}

export interface StatBase {
  name: string;
  description: string;
  value: number;
}

export interface CollisionMethods {
  isObstacle(point: Vector2): boolean;
  isObstruction(point: Vector2): boolean;
  set(point: Vector2, isObstacle: boolean, isObstruction: boolean): void;
}
