# tecs-example

A simple roguelike using [rot.js](https://ondras.github.io/rot.js) to demonstrate the proper care and feeding of [tecs](https://github.com/noahlange/tecs).

I took quite a bit of inspiration from [Fritzy's](https://github.com/fritzy) [roguelike example](https://github.com/fritzy/ecs-js-example) for [ape-ecs](https://github.com/fritzy/ape-ecs).

```
git clone https://github.com/noahlange/tecs-example.git
cd tecs-example
npm i && npm start
```

Production builds are currently broken, courtesy of `bondage`'s `enbf-parser` dependency, which explodes. Long-term plan is to ditch bondage anyway.
