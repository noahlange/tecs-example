import type { DamageType, EffectType } from './utils/enums';

export interface Point {
  x: number;
  y: number;
}

export interface DamageDefinition {
  value: string;
  type: DamageType;
}

export interface Size {
  w: number;
  h: number;
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

export type Rect = Point & Size;

export type RGBColor = [number, number, number];

export interface InputEvent {
  type: 'pointer' | 'keyboard';
  key: string;
  point?: Point;
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

export * from './utils/enums';
