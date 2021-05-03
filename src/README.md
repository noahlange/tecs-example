# tecs-example

```
@
├── core
│   ├── components
│   ├── entities
│   ├── managers
│   ├── maps
│   ├── prefabs
│   ├── scenes
│   └── systems
├── lib
│   ├── types.ts
│   └── enums.ts
├── maps
│   ├── generators
│   ├── scenes
├── ui
│   ├── components
│   ├── scenes
│   └── styles
├── utils
│   ├── geometry
│   ├── pixi
│   └── tiled
└── workers
```

## `@core`

Stuff in `@core` is everything that hooks into the ECS.

- `./scenes` - game/interface modes (Gameplay, Menu, Inventory, &c.).
- `./managers` - bridges from external APIs (PIXI, browser inputs, etc.) to the ECS.
- `./maps` - map generation code
- `./systems` - ECS systems
- `./components` - ECS component classes
- `./entities` - ECS entity classes
- `./prefabs` - Prepopulated entities

## `@ui`

Preact components and stylesheets.

- `./components` - generic Preact components
- `./scenes` - UI components for specific scenes
- `./styles` - bases styles

## `@utils`

- `./geometry` - points, lines, shapes, sizes, etc.
- `./pixi` - functions with direct PIXI integration that cannot be imported into workers
- `./tiled` - functions for working with Tiled files and functionality
- `./` - generic utility functions

## `@lib`

Home to generic utility classes (e.g., `Vector2Array<T>` and `UIList`) and base classes for extension elsewhere (e.g., `Scene`, `Manager`).

- `./types.ts` - type declrations
- `./enums.ts` - enums
