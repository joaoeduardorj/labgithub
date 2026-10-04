import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

// Sessão de login atual. `carregando` fica true até o Supabase dizer se há alguém logado,
// inclusive quando a pessoa chega pelo link mágico do e-mail.
export function useSessao() {
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => setSessao(nova));
    return () => data.subscription.unsubscribe();
  }, []);

  return { sessao, carregando };
}
