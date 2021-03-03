import type { Point } from '../types';

interface DialogueNode {
  title: string;
  tags: string;
  body: string;
  position: Point;
  colorID: number;
}

export const dialogue: Record<string, DialogueNode[]> = { dialogue: [] };
