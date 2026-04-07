
-- Drop the header-based policies (not practical with JS client)
DROP POLICY IF EXISTS "Visitors can view own sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Visitors can create sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Visitors can update own sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Visitors can view own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitors can insert own messages" ON public.chat_messages;

-- Create a helper function to avoid repeating logic
CREATE OR REPLACE FUNCTION public.get_visitor_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    current_setting('request.headers', true)::json->>'x-visitor-id',
    ''
  );
$$;

-- Chat sessions policies
CREATE POLICY "Public can create sessions"
ON public.chat_sessions FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Visitors see own sessions"
ON public.chat_sessions FOR SELECT TO public
USING (
  visitor_id = public.get_visitor_id()
  OR (SELECT auth.role()) = 'authenticated'
);

CREATE POLICY "Visitors update own sessions"
ON public.chat_sessions FOR UPDATE TO public
USING (
  visitor_id = public.get_visitor_id()
  OR (SELECT auth.role()) = 'authenticated'
);

-- Chat messages policies
CREATE POLICY "Visitors see own messages"
ON public.chat_messages FOR SELECT TO public
USING (
  session_id IN (SELECT id FROM public.chat_sessions WHERE visitor_id = public.get_visitor_id())
  OR (SELECT auth.role()) = 'authenticated'
);

CREATE POLICY "Visitors insert own messages"
ON public.chat_messages FOR INSERT TO public
WITH CHECK (
  session_id IN (SELECT id FROM public.chat_sessions WHERE visitor_id = public.get_visitor_id())
  OR (SELECT auth.role()) = 'authenticated'
);
