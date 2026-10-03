import { useRef, useState } from "react";
import CampoCidade from "./CampoCidade.jsx";
import { validarEntrada } from "../lib/mapa.js";

// Formulário de entrada. Valida tudo e entrega os dados prontos para o cálculo em `onCalcular`.
export default function Formulario({ onCalcular }) {
  const [nome, setNome] = useState("");
  const [nasc, setNasc] = useState("");
  const [hora, setHora] = useState("");
  const [textoCidade, setTextoCidade] = useState("");
  const [lugar, setLugar] = useState(null);
  const [erro, setErro] = useState(null); // { erro, campo }
  const refs = { nome: useRef(null), nasc: useRef(null), hora: useRef(null), cidade: useRef(null) };

  function enviar(e) {
    e.preventDefault();
    const r = validarEntrada({ nome, nasc, hora, lugar, textoCidade });
    if (r.erro) {
      setErro(r);
      refs[r.campo].current?.focus();
      return;
    }
    setErro(null);
    onCalcular(r.dados);
  }

  const invalido = campo => erro?.campo === campo;

  return (
    <div className="form-group">
      <h1 className="form-title">Sua idade nas estrelas</h1>
      <p className="lede">Descubra sua idade, seu signo, seu ascendente e a fase da lua no momento em que você nasceu.</p>
      <form id="form" noValidate onSubmit={enviar}>
        <div className="field">
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome" name="nome" className="input" type="text" autoComplete="name" ref={refs.nome}
            placeholder="Ex.: Maria da Silva Santos" aria-describedby="erro" aria-invalid={invalido("nome")}
            value={nome} onChange={e => setNome(e.target.value)}
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="nasc">Data de nascimento</label>
            <input
              id="nasc" name="nasc" className="input" type="date" ref={refs.nasc}
              aria-describedby="erro" aria-invalid={invalido("nasc")}
              value={nasc} onChange={e => setNasc(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="hora">Hora</label>
            <input
              id="hora" name="hora" className="input" type="time" ref={refs.hora}
              aria-describedby="erro" aria-invalid={invalido("hora")}
              value={hora} onChange={e => setHora(e.target.value)}
            />
          </div>
        </div>
        <CampoCidade
          texto={textoCidade} onTexto={setTextoCidade} onEscolher={setLugar}
          invalido={invalido("cidade")} inputRef={refs.cidade}
        />
        <button type="submit" className="btn-submit">Calcular</button>
        <p className="error" id="erro" role="alert" hidden={!erro}>{erro?.erro}</p>
      </form>
    </div>
  );
}
