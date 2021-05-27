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

- `scenes` - game/interface modes (Gameplay, Menu, Inventory, &c.).
- `managers` - bridges from external APIs (PIXI, browser inputs, etc.) to the ECS.
- `maps` - map generation code
- `systems` - ECS systems
- `components` - ECS component classes
- `entities` - ECS entity classes
- `prefabs` - predefined entities

## `@ui`

Preact components and stylesheets.

- `components` - generic Preact components
- `scenes` - UI components for specific scenes
- `styles` - base styles

## `@utils`

Generic utility functions. Standalone submodules include:

- `geometry` - points, lines, shapes, sizes, etc.
- `tiled` - functions for working with Tiled files and functionality
- `pixi` - functions with direct PIXI integration
  - this _cannot_ be imported into a worker

## `@lib`

Home to generic utility classes (e.g., `Vector2Array<T>` and `UIList`) and base classes for extension elsewhere (e.g., `Scene`, `Manager`).

- `types.ts` - type declarations
- `enums.ts` - enums

## `@workers`

Additional code to be run asynchronously in web workers, split intro entry files and actual-code files. Be careful what you import—Pixi will not run inside a web worker due to the lack of a DOM.
