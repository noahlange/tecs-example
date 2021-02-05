import type { Point } from '../types';
import { tileAt } from './';

const tiles: Record<string, Point> = {
  // symbols
  '@': { x: 0, y: 4 },
  ' ': { x: 0, y: 2 },
  '!': { x: 1, y: 2 },
  '"': { x: 2, y: 2 },
  '#': { x: 3, y: 2 },
  $: { x: 4, y: 2 },
  '%': { x: 5, y: 2 },
  '&': { x: 6, y: 2 },
  "'": { x: 7, y: 2 },
  '(': { x: 8, y: 2 },
  ')': { x: 9, y: 2 },
  '*': { x: 10, y: 2 },
  '+': { x: 11, y: 2 },
  ',': { x: 12, y: 2 },
  '-': { x: 13, y: 2 },
  '.': { x: 14, y: 2 },
  '/': { x: 15, y: 2 },
  // numbers
  '0': { x: 0, y: 3 },
  '1': { x: 1, y: 3 },
  '2': { x: 2, y: 3 },
  '3': { x: 3, y: 3 },
  '4': { x: 4, y: 3 },
  '5': { x: 5, y: 3 },
  '6': { x: 6, y: 3 },
  '7': { x: 7, y: 3 },
  '8': { x: 8, y: 3 },
  '9': { x: 9, y: 3 },
  // punctuation
  '`': { x: 0, y: 6 },
  ':': { x: 10, y: 3 },
  ';': { x: 11, y: 3 },
  '<': { x: 12, y: 3 },
  '=': { x: 13, y: 3 },
  '>': { x: 14, y: 3 },
  '?': { x: 15, y: 3 },
  '[': { x: 11, y: 5 },
  '\\': { x: 12, y: 5 },
  ']': { x: 13, y: 5 },
  '^': { x: 14, y: 5 },
  _: { x: 15, y: 5 },
  // letters - caps
  A: { x: 1, y: 4 },
  B: { x: 2, y: 4 },
  C: { x: 3, y: 4 },
  D: { x: 4, y: 4 },
  E: { x: 5, y: 4 },
  F: { x: 6, y: 4 },
  G: { x: 7, y: 4 },
  H: { x: 8, y: 4 },
  I: { x: 9, y: 4 },
  J: { x: 10, y: 4 },
  K: { x: 11, y: 4 },
  L: { x: 12, y: 4 },
  M: { x: 13, y: 4 },
  N: { x: 14, y: 4 },
  O: { x: 15, y: 4 },
  P: { x: 0, y: 5 },
  Q: { x: 1, y: 5 },
  R: { x: 2, y: 5 },
  S: { x: 3, y: 5 },
  T: { x: 4, y: 5 },
  U: { x: 5, y: 5 },
  V: { x: 6, y: 5 },
  W: { x: 7, y: 5 },
  X: { x: 8, y: 5 },
  Y: { x: 9, y: 5 },
  Z: { x: 10, y: 5 },
  // letters - caps
  a: { x: 1, y: 6 },
  b: { x: 2, y: 6 },
  c: { x: 3, y: 6 },
  d: { x: 6, y: 6 },
  e: { x: 5, y: 6 },
  f: { x: 6, y: 6 },
  g: { x: 7, y: 6 },
  h: { x: 8, y: 6 },
  i: { x: 9, y: 6 },
  j: { x: 10, y: 6 },
  k: { x: 11, y: 6 },
  l: { x: 12, y: 6 },
  m: { x: 13, y: 6 },
  n: { x: 14, y: 6 },
  o: { x: 15, y: 6 },
  p: { x: 0, y: 7 },
  q: { x: 1, y: 7 },
  r: { x: 2, y: 7 },
  s: { x: 3, y: 7 },
  t: { x: 4, y: 7 },
  u: { x: 5, y: 7 },
  v: { x: 6, y: 7 },
  w: { x: 7, y: 7 },
  x: { x: 8, y: 7 },
  y: { x: 9, y: 7 },
  z: { x: 10, y: 7 },
  '{': { x: 11, y: 7 },
  '|': { x: 12, y: 7 },
  '}': { x: 13, y: 7 },
  '~': { x: 14, y: 7 }
};

export const tileMap = Object.entries(tiles).reduce(
  (a: Record<string, [number, number]>, [key, value]) => {
    return { ...a, [key]: tileAt(value) };
  },
  {}
);

// https://opengameart.org/content/8x8-1bit-roguelike-tiles-bitmap-font
export const glyphs = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAVFBMVEUAAAD///8pjHwTJi4AAAAAAAAAAABlfXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADsL0whAAAAHHRSTlMA////////////////////////////////////qXetUQAABsJJREFUeJzNWouC4ygMw///07c3DbYk20DTxwyzKQkFW8iyk7Y7xr7Z/4eNx9/P6b8jrq9J9niF9jPrhWaP9XFcHhlAuPNFl+8HADphQC083ExiwCYEYWCug/07QECSN5gRzZ1fAIQBBRAEZINu7cJDEzIjDYBDDcx1JAD0oA4LAAykYaDTAIdgBABUhURso1GfcKQBFmFMBwCaFYc5cqiBSVu5j9VebTehXQeiGdTfMuT7Ol4z0uxOUhtjAoGXGF7ScAAI+m8hSCEwcGv0z5amciRdxMvYZA3MbJtprz1EPBJ/YNZA8oyxoAbtgAZiITmODdUiqCrb9LAEUGggTeF+oAhM2gAzwkTHwL00JBN1Dy5esP7NZhyzKAt6z5IC5DePGy4XAEjdKDxTj9I78D2i+naMChtTn2SXC1ZYebY0Nw8kfglpzBWRa7YAMGdMyktRqJaAYIFNnwyoBnDMwJ4gdmi+wwyV/Wts6o2Wd+4eCk0zuSussyAN/7mykG4i6fZK6TjfSDehRT1lMYpfi+DSNeZ7BJ+t6dy6PtSSAb8piHzilTEIooTcAhBmc97i3kv/keAEmAlK6Sk7rjiY6xh5SbHJNfrfZX7HgMYCX4lWs0MAXSGqywYMiNb0EYtDgL2uV8eVTytHf7VJbJQBuitbfNQafjn8BQ3MezhZN7/V13UAB1yclIY+GRw0aZzTF46iDugAmSukjpcNAEmuYEb95dJqowIgYh1guAYggOdHZGsAPM8A7mbPgIcl+xMtHGjAhXSoAesBDNe0C2WbBRhUXIzUQxYYbCbC64Z+u8mOQ1NEAb9JvRsRBi8qDBzNE0VAsWQtjCt8+f32cBeiDBCPHQOAlZWjQVphwWuHgBiB5CWFoAAQn1vMP7ejnZSvqdcGQDk9UgqTeh2ASXBlxwUVLQApEAogVRahHl7L6DcAtnmN2UCIAeNEL0A11Or3jxSC+kP6agyRmxIdpFiefYJgD2B1Vb1xSjQWPrj2AdFAVQ0H91RQ4Os+tq+g94cZ1K2UBZxWCHjYKOwxA00tAMfMwBqAMLYBcLJ7cvA5BjYa4MtUN0gKMW7mvy5onfnz7T5OqZx37by8MGuj/pYbZI3XmOaYf6jAlKYPy7oDqh8MlBPbQsG8AVFwIB0wrkmhWZM4lfzHNMbrYGbEN6iXK7QDC0oGcgsH7HAwIAoNATDZ4oxxo4HsH0tMPPdDLFMvgASY5YkL/wUV3fhpOnQ7366/CUA3/AkARp2suA0AQi3qgzG85AU4InCMDVjVRDMi9wZBYe51AEUIjCjXlkJwk/oi5E+LhtcBR2cAOkO/BcBLcTPevQ+V8eiolv+Y8AmioqmXMJK1BA6qscFzmyzoHdAuk5plh5GryOoMD62TNAAAwE5SPbOYARyFtXyvMlIAejuAkkqmUBi/G4KIKsSyAZDiD4srjcAa0/WNcCFtixAs066Lpey6s7OM/TsO+Nm/QTzo13ClpmhlHnfzHvHdUGbQHwEY0O0BDPy/JbTKGZjzaw0s60B5LSGwSbEeNK4SO6wDJwDgv0Dw6/XC+KpYn1Fehm7Glq+v87lxDEkJoDD8BACNLas+tQ+kocTWNdGUlcnFtk0V8/wIMXA6/Z0YjmjoGylNQBdzSvodMYVxDwCQImTdgc3vePzM8x5Vl0vtIQNhEF3medjPXDLsoZ4cxjao5YKBUwAA7h5WRv+0Bq4Xu5hNC02+MYH5A8bBVIwf+b8ikK0EQRF8JxnS26Hb/FUwMu6QAmc+zy9HeL5XOC44XeGpQRj3QwU50vtvbbKH8Gb1vEOrx5PDP93AsgW8Ue1FprQu6h2UUzTtXczFdIz0yxbRCi6scar/md+Rm+B/RFbUousANAz4BmyeYo4P9d8DSCU4MdQAwAcUg5Pwh/6rnTUtv9/457plMhn2+bUm6u3vrm8GVakWrgsEVq6/4Zai5U4l3QIAPo7E+N1A4VOEi5AB8CWo+/MASJ5RHykxHEBXaI4ANCEYwIAnjAB4X2tDABsURrAAPf0s2OJIAA41cDMEX2g7VFa1zfiIfstAjHb3AkQZfenfmscuSUPRRWRRCbCm5QCA3xTp2nfqxPhzxVcA4BMxBPJCVLtCGK+HwMI/M9BqsfZzX4SsA1/3NzP00Uz4f7LSTs67frHO+CSeQBjXxv/mYJ9YssE/Y15qFs1CoR7zkyNW6Zka89PtJdIRCVuIfQKAa8Sfetv++Y3UU8Wd4GuTdTYAlxJlcwvMgDMSdQGzpAHgJiGtfBTTLQNY7nzOIWlhCBgAONThLhQuOCgDcLAGAkDp4DANjU9eS8P/AORgFGTApBH6AAAAAElFTkSuQmCC`;
