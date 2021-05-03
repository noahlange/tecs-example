import type { JSX } from 'preact';

interface ShowIfProps<T> {
  value: T | null | undefined;
  children: JSX.Element | ((value: T) => JSX.Element | null);
}

export default function ShowIf<T>(props: ShowIfProps<T>): JSX.Element | null {
  const { value, children } = props;
  return (value ?? null) !== null
    ? typeof children === 'function'
      ? children(value as T)
      : children
    : null;
}
