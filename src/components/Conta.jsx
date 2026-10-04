import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { validarEmail } from "../lib/conta.js";

// Login por link mágico: a pessoa digita o e-mail, recebe um link e volta logada.
export default function Conta({ sessao, carregando }) {
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState({ tipo: "inicio" }); // inicio | enviando | enviado | erro

  if (!supabase || carregando) return null;

  if (sessao) {
    return (
      <div className="conta">
        <p className="conta-info">Conectado como <b>{sessao.user.email}</b></p>
        <button type="button" className="btn-link" onClick={() => supabase.auth.signOut()}>Sair</button>
      </div>
    );
  }

  if (estado.tipo === "enviado") {
    return (
      <div className="conta">
        <p className="conta-info">Enviamos um link para <b>{estado.email}</b>. Abra o e-mail e clique nele para entrar.</p>
        <button type="button" className="btn-link" onClick={() => setEstado({ tipo: "inicio" })}>Usar outro e-mail</button>
      </div>
    );
  }

  async function entrar(e) {
    e.preventDefault();
    const r = validarEmail(texto);
    if (r.erro) return setEstado({ tipo: "erro", mensagem: r.erro });
    setEstado({ tipo: "enviando" });
    const { error } = await supabase.auth.signInWithOtp({
      email: r.email,
      options: { emailRedirectTo: window.location.origin },
    });
    setEstado(error
      ? { tipo: "erro", mensagem: "Não foi possível enviar o link. Tente de novo em instantes." }
      : { tipo: "enviado", email: r.email });
  }

  const erro = estado.tipo === "erro" ? estado.mensagem : null;

  return (
    <form className="conta" noValidate onSubmit={entrar}>
      <p className="conta-info">Entre para salvar seus mapas.</p>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email" name="email" className="input" type="email" autoComplete="email"
          placeholder="voce@exemplo.com" aria-describedby="erro-conta" aria-invalid={Boolean(erro)}
          value={texto} onChange={e => setTexto(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-submit" disabled={estado.tipo === "enviando"}>
        {estado.tipo === "enviando" ? "Enviando…" : "Receber link de acesso"}
      </button>
      <p className="error" id="erro-conta" role="alert" hidden={!erro}>{erro}</p>
    </form>
  );
}
