-- rls_auto_enable() é o event trigger que liga o RLS em toda tabela nova do schema public.
-- Ela só deve rodar como trigger, então ninguém precisa chamá-la pela API (/rest/v1/rpc).
-- O trigger continua funcionando: o Postgres não confere EXECUTE ao disparar um event trigger.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
