import type { ECS } from '@core';
import type { ComponentChildren } from 'preact';

import { createContext, h, render } from 'preact';

export const GameContext = createContext<ECS>((null as any) as ECS);

const e = document.getElementById('ui')!;

export function renderWithContext(
  game: ECS,
  children: ComponentChildren | null = null
): void {
  const component = children && (
    <GameContext.Provider value={game}>{children}</GameContext.Provider>
  );
  return render(component, e);
}

export function unrender(): void {
  return render(null, e);
}
