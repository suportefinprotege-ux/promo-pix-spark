import { supabase } from "@/integrations/supabase/client";

interface TikTokEventParams {
  event: string;
  event_id?: string;
  properties?: Record<string, unknown>;
  user?: {
    email?: string;
    phone?: string;
  };
}

export const sendTikTokServerEvent = async (params: TikTokEventParams) => {
  try {
    const { data, error } = await supabase.functions.invoke("tiktok-event", {
      body: params,
    });

    if (error) {
      console.error("TikTok server event error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("TikTok server event failed:", err);
    return null;
  }
};

// Helper to fire both client pixel + server event
export const trackTikTokEvent = (
  event: string,
  properties?: Record<string, unknown>,
  user?: { email?: string; phone?: string }
) => {
  const event_id = crypto.randomUUID();

  // Client-side pixel
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, { ...properties, event_id });
  }

  // Server-side event (fire and forget)
  sendTikTokServerEvent({ event, event_id, properties, user });
};
