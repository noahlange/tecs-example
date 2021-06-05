export type UnwrapIterable<T> = T extends Iterable<infer R> ? R : T;
