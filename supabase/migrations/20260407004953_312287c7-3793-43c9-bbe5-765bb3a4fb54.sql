
-- Update chat_sessions policies to use admin role instead of any authenticated
DROP POLICY IF EXISTS "Visitors see own sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Visitors update own sessions" ON public.chat_sessions;

CREATE POLICY "Visitors or admins see sessions"
ON public.chat_sessions FOR SELECT TO public
USING (
  visitor_id = public.get_visitor_id()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Visitors or admins update sessions"
ON public.chat_sessions FOR UPDATE TO public
USING (
  visitor_id = public.get_visitor_id()
  OR public.has_role(auth.uid(), 'admin')
);

-- Update chat_messages policies to use admin role
DROP POLICY IF EXISTS "Visitors see own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Visitors insert own messages" ON public.chat_messages;

CREATE POLICY "Visitors or admins see messages"
ON public.chat_messages FOR SELECT TO public
USING (
  session_id IN (SELECT id FROM public.chat_sessions WHERE visitor_id = public.get_visitor_id())
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Visitors or admins insert messages"
ON public.chat_messages FOR INSERT TO public
WITH CHECK (
  session_id IN (SELECT id FROM public.chat_sessions WHERE visitor_id = public.get_visitor_id())
  OR public.has_role(auth.uid(), 'admin')
);
