export interface ChatSession {
  _id?: string;
  id?: string;
  user_id?: string;
  title?: string;
  created_at?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  intent?: string;
  confidence?: number;
  agent?: string;
  sentiment?: string;
}

export interface CreateSessionResponse {
  session_id: string;
  created_at: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
  intent?: string;
  confidence?: number;
  agent?: string;
  has_chart?: boolean;
  suggestions?: string[];
}
