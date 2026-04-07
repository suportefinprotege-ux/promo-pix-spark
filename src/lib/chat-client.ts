import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

/**
 * Creates a Supabase client with the x-visitor-id header set
 * for RLS policies that scope chat data to the visitor.
 */
export function getVisitorId(): string {
  let id = localStorage.getItem("chat_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_visitor_id", id);
  }
  return id;
}

let _chatClient: ReturnType<typeof createClient<Database>> | null = null;

export function getChatSupabase() {
  if (!_chatClient) {
    const visitorId = getVisitorId();
    _chatClient = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          storage: localStorage,
          persistSession: true,
          autoRefreshToken: true,
        },
        global: {
          headers: {
            "x-visitor-id": visitorId,
          },
        },
      }
    );
  }
  return _chatClient;
}
