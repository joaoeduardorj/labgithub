import { useState } from "react";
import Formulario from "./components/Formulario.jsx";
import Resultados from "./components/Resultados.jsx";
import Cosmos from "./components/Cosmos.jsx";
import Conta from "./components/Conta.jsx";
import { useSessao } from "./hooks/useSessao.js";
import { calcularMapa } from "./lib/mapa.js";

export default function App() {
  const [mapa, setMapa] = useState(null);
  // Muda a cada cálculo: a `key` nova recria os cartões e reinicia a animação de entrada.
  const [calculo, setCalculo] = useState(0);
  const { sessao, carregando } = useSessao();

  function calcular(dados) {
    setMapa(calcularMapa(dados));
    setCalculo(n => n + 1);
  }

  return (
    <div className="container">
      <section className="input-section">
        <Formulario onCalcular={calcular} />
        <Conta sessao={sessao} carregando={carregando} />
      </section>

      <section className={"results-section" + (mapa ? " revelado" : "")} aria-live="polite">
        <Cosmos />
        {mapa
          ? <Resultados key={calculo} mapa={mapa} />
          : <p className="empty-state" id="vazio">Preencha seu nome e data de nascimento para descobrir informações fascinantes sobre você ✨</p>}
      </section>
    </div>
  );
}
