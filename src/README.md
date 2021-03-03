# tecs-example

```
@
├── core
│   ├── managers
│   └── scenes
├── ecs
│   ├── components
│   ├── entities
│   └── systems
├── lib
├── types
└── utils
```

## `@core`

Stuff in `@core` is not directly integrated with the ECS. `./scenes` are different game modes (Gameplay, Menu, Inventory, &c.). `./managers` typically provide a bridge from some external API (PIXI, browser inputs, etc.) to the ECS.

## `@ecs`

## `@lib`

Utility classes. `Array2D<T>` and `UIList` are probably the most relevant.

## `@types`

## `@utils`
