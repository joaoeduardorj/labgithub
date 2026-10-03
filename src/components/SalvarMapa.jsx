import { useState } from "react";

// Barra abaixo dos resultados: salva o mapa atual na conta, ou convida a entrar.
export default function SalvarMapa({ logado, salvo, onSalvar }) {
  const [estado, setEstado] = useState(null); // null | "salvando" | "erro"

  if (!logado) return <p className="salvar-mapa">Entre com seu e-mail para salvar este mapa.</p>;
  if (salvo) return <p className="salvar-mapa">✓ Mapa salvo em <b>Meus mapas</b>.</p>;

  async function salvar() {
    setEstado("salvando");
    try {
      await onSalvar();
      setEstado(null);
    } catch {
      setEstado("erro");
    }
  }

  return (
    <div className="salvar-mapa">
      <button type="button" className="btn-submit" onClick={salvar} disabled={estado === "salvando"}>
        {estado === "salvando" ? "Salvando…" : "Salvar mapa"}
      </button>
      <p className="error" role="alert" hidden={estado !== "erro"}>Não foi possível salvar. Tente de novo.</p>
    </div>
  );
}
