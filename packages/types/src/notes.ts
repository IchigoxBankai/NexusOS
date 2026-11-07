export interface NoteItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  folder?: string;
  tags?: string[];
  is_pinned?: boolean;
}

