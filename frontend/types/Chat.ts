import type { Role } from './Role';

export interface ChatMessage {
  role: Role;
  content: string;
}
