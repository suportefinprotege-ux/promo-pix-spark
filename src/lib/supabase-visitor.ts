import { supabase } from "@/integrations/supabase/client";

export function getVisitorId(): string {
  let id = localStorage.getItem("chat_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("chat_visitor_id", id);
  }
  return id;
}

/**
 * Sets the x-visitor-id header on the global supabase client
 * so RLS policies can scope chat data to the visitor.
 */
export function setVisitorHeader(visitorId: string) {
  supabase.headers = {
    ...supabase.headers,
    "x-visitor-id": visitorId,
  };
}
