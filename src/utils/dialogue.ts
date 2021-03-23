import type { Vector2 } from '../types';
import dlg from '../assets/dialogue/gatsby.json';

interface DialogueNode {
  title: string;
  tags: string;
  body: string;
  position: Vector2;
  colorID: number;
}

export const dialogue: Record<string, DialogueNode[]> = { dialogue: dlg };
