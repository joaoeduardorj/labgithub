import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { paraLinha } from "../lib/mapasSalvos.js";

// Mapas salvos de quem está logado. Não há filtro por usuário nas consultas:
// o RLS da tabela `mapas` garante que cada pessoa só recebe (e só mexe em) os próprios mapas.
export function useMapas(sessao) {
  const [mapas, setMapas] = useState([]);
  const [erro, setErro] = useState(null);
  const userId = sessao?.user.id;

  useEffect(() => {
    setMapas([]);
    setErro(null);
    if (!supabase || !userId) return;
    let ativo = true;
    supabase.from("mapas").select("*").order("criado_em", { ascending: false })
      .then(({ data, error }) => {
        if (!ativo) return;
        if (error) setErro("Não foi possível carregar seus mapas.");
        else setMapas(data);
      });
    return () => { ativo = false; };
  }, [userId]);

  // Devolve a linha criada (com id) ou lança erro.
  async function salvar(dados) {
    const { data, error } = await supabase.from("mapas").insert(paraLinha(dados)).select().single();
    if (error) throw error;
    setMapas(lista => [data, ...lista]);
    return data;
  }

  async function apagar(id) {
    const { error } = await supabase.from("mapas").delete().eq("id", id);
    if (error) throw error;
    setMapas(lista => lista.filter(m => m.id !== id));
  }

  return { mapas, erro, salvar, apagar };
}
