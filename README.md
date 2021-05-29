# tecs-example

A roguelike to demonstrate the proper care and feeding of [tecs](https://github.com/noahlange/tecs). Primary dependencies include [PIXI](https://pixijs.io/) for graphics, [Preact](https://preactjs.com/) for the UI and [malwoden](https://malwoden.com/) for FOV calculations.

Takes extensive inspiration from ddmills' [sleepy](https://github.com/ddmills/sleepy)
and Fritzy's [roguelike example](https://github.com/fritzy/ecs-js-example) for [ape-ecs](https://github.com/fritzy/ape-ecs).

```
git clone https://github.com/noahlange/tecs-example.git
cd tecs-example
npm i && npm start
```

Includes two misc. command line tools:

- `atlas-gen`: generates image atlases with animation data.
- `zip`: compresses json files using pako (for import with `jsonz.read()`)

## ideas / todo

- integration with https://github.com/claus/react-dat-gui
  - decorators to define component field types?
- reimplement dialogue system
- confirm correct behavior of object destruction/recreation on chunk changes
