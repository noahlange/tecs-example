# @game

This directory is home to "implementation-specific" code that wouldn't apply
generically to every project.

## Required exports

The generic game code will expect a handful of exports to be available, mostly enums and a few query functions.

### @game

```ts
import type { System } from 'tecs';

export const sync: System;
export const async: System;
```

### @game/enums

```ts
export enum DamageType {}
export enum EffectType {}
export enum ItemType {}
export enum EquipSlot {}
export enum GameAction {}

export type GameActionType = {
  id: GameAction;
};
```

### @game/utils

```ts
type A = AffectedEntity; // an entity that can be affected by an EffectType
type I = InventoryItemEntity; // an entity that is an inventory item
type H = HasInventoryEntity; // an entity that has an inventory
type C = CombatEntity; // an entity that can participate in combat
type E = EquippableEntity; // an entity representing something that can be equipped (spell, attack, weapon, etc.)

export function queryInventoryItems(ctx: Context): Iterable<I>;
export function queryInventoryEntities(ctx: Context): Iterable<H>;
export function queryCombatEntities(ctx: Context): Iterable<C>;

export function applyEffect(entity: A, type: EffectType, value: number): void;
export function applyDamage(source: C, target: C, equip: E): void;
```
