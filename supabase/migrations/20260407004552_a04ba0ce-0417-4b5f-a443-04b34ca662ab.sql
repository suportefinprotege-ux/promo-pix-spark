
-- Drop old overly-permissive chat policies
DROP POLICY IF EXISTS "Anyone can view their own session" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.chat_messages;

-- Chat sessions: visitors see only their own sessions
CREATE POLICY "Visitors can view own sessions"
ON public.chat_sessions FOR SELECT TO public
USING (
  visitor_id = coalesce(
    current_setting('request.headers', true)::json->>'x-visitor-id',
    ''
  )
  OR (SELECT auth.role()) = 'authenticated'
);

-- Chat sessions: visitors can create sessions
CREATE POLICY "Visitors can create sessions"
ON public.chat_sessions FOR INSERT TO public
WITH CHECK (true);

-- Chat sessions: visitors can update only their own sessions
CREATE POLICY "Visitors can update own sessions"
ON public.chat_sessions FOR UPDATE TO public
USING (
  visitor_id = coalesce(
    current_setting('request.headers', true)::json->>'x-visitor-id',
    ''
  )
  OR (SELECT auth.role()) = 'authenticated'
);

-- Chat messages: visitors see messages from their own sessions only
CREATE POLICY "Visitors can view own messages"
ON public.chat_messages FOR SELECT TO public
USING (
  session_id IN (
    SELECT id FROM public.chat_sessions
    WHERE visitor_id = coalesce(
      current_setting('request.headers', true)::json->>'x-visitor-id',
      ''
    )
  )
  OR (SELECT auth.role()) = 'authenticated'
);

-- Chat messages: visitors can insert messages to their own sessions
CREATE POLICY "Visitors can insert own messages"
ON public.chat_messages FOR INSERT TO public
WITH CHECK (
  session_id IN (
    SELECT id FROM public.chat_sessions
    WHERE visitor_id = coalesce(
      current_setting('request.headers', true)::json->>'x-visitor-id',
      ''
    )
  )
  OR (SELECT auth.role()) = 'authenticated'
);
