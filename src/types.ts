import type { DataType, EntityClass } from 'tecs';

import type { DamageType, EffectType, Tag } from './enums';

export interface Prefab<T extends EntityClass = EntityClass> {
  entity: T;
  tags: Tag[];
  data: DataType<T>;
}

export interface Vector2 {
  x: number;
  y: number;
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

export interface Size {
  width: number;
  height: number;
}

export interface BaseInputEvent {
  name: string;
  isKeyboard: boolean;
}

export interface MouseInputEvent extends BaseInputEvent {
  x: number;
  y: number;
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
