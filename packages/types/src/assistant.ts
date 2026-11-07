export type AssistantMessageRole = 'user' | 'assistant' | 'system';

export interface AssistantActionProposal {
  id: string;
  type: 'schedule_meeting' | 'create_task' | 'reorganize_day' | 'summarize_note';
  title: string;
  payload: Record<string, unknown>;
}

export interface AssistantMessage {
  id: string;
  role: AssistantMessageRole;
  content: string;
  timestamp: string;
  actions?: AssistantActionProposal[];
}

