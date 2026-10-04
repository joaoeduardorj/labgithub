import { useState } from "react";
import Formulario from "./components/Formulario.jsx";
import Resultados from "./components/Resultados.jsx";
import Cosmos from "./components/Cosmos.jsx";
import Conta from "./components/Conta.jsx";
import MeusMapas from "./components/MeusMapas.jsx";
import SalvarMapa from "./components/SalvarMapa.jsx";
import { useSessao } from "./hooks/useSessao.js";
import { useMapas } from "./hooks/useMapas.js";
import { calcularMapa } from "./lib/mapa.js";
import { deLinha } from "./lib/mapasSalvos.js";
import { supabase } from "./lib/supabase.js";

export default function App() {
  const [mapa, setMapa] = useState(null);
  // Dados que geraram o mapa na tela e, se ele já está salvo, o id da linha no banco.
  const [atual, setAtual] = useState(null); // { dados, salvoId }
  // Muda a cada cálculo: a `key` nova recria os cartões e reinicia a animação de entrada.
  const [calculo, setCalculo] = useState(0);
  const { sessao, carregando } = useSessao();
  const { mapas, erro, salvar, apagar } = useMapas(sessao);

  function calcular(dados, salvoId = null) {
    setMapa(calcularMapa(dados));
    setAtual({ dados, salvoId });
    setCalculo(n => n + 1);
  }

  function abrir(linha) {
    const dados = deLinha(linha);
    if (dados) calcular(dados, linha.id);
  }

  async function salvarAtual() {
    const linha = await salvar(atual.dados);
    setAtual(a => ({ ...a, salvoId: linha.id }));
  }

  async function apagarMapa(id) {
    await apagar(id);
    setAtual(a => (a?.salvoId === id ? { ...a, salvoId: null } : a));
  }

  return (
    <div className="container">
      <section className="input-section">
        <Formulario onCalcular={calcular} />
        <Conta sessao={sessao} carregando={carregando} />
        {sessao && <MeusMapas mapas={mapas} erro={erro} atualId={atual?.salvoId} onAbrir={abrir} onApagar={apagarMapa} />}
      </section>

      <section className={"results-section" + (mapa ? " revelado" : "")} aria-live="polite">
        <Cosmos />
        {mapa
          ? <Resultados key={calculo} mapa={mapa} />
          : <p className="empty-state" id="vazio">Preencha seu nome e data de nascimento para descobrir informações fascinantes sobre você ✨</p>}
        {mapa && supabase && !carregando && (
          <SalvarMapa key={calculo} logado={Boolean(sessao)} salvo={Boolean(atual?.salvoId)} onSalvar={salvarAtual} />
        )}
      </section>
    </div>
  );
}
