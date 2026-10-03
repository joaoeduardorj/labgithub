-- Mapas salvos: os dados de nascimento de cada mapa, ligados à conta de quem salvou.
-- Os resultados (signo, ascendente, Lua) não ficam aqui: são recalculados em src/lib/ a partir destes dados.

create table public.mapas (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome             text not null check (char_length(nome) between 1 and 120),
  data_nascimento  date not null,
  hora_nascimento  time not null,
  cidade           text not null check (char_length(cidade) between 1 and 200),
  latitude         double precision not null check (latitude between -90 and 90),
  longitude        double precision not null check (longitude between -180 and 180),
  fuso             text not null,  -- fuso IANA da cidade, ex.: America/Sao_Paulo
  criado_em        timestamptz not null default now()
);

create index mapas_user_id_idx on public.mapas (user_id);

-- RLS: sem política, ninguém acessa. Cada política abaixo libera só as linhas da própria pessoa.
alter table public.mapas enable row level security;

create policy "Ler os próprios mapas" on public.mapas
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Criar mapas para si" on public.mapas
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Editar os próprios mapas" on public.mapas
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Apagar os próprios mapas" on public.mapas
  for delete to authenticated
  using ((select auth.uid()) = user_id);
