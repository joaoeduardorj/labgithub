import { useState } from "react";
import { detalheMapa } from "../lib/mapasSalvos.js";

// Lista dos mapas salvos: clicar abre o mapa nos resultados; "Apagar" remove da conta.
export default function MeusMapas({ mapas, erro, atualId, onAbrir, onApagar }) {
  const [falhou, setFalhou] = useState(false);

  async function apagar(m) {
    if (!window.confirm(`Apagar o mapa de ${m.nome}?`)) return;
    try {
      setFalhou(false);
      await onApagar(m.id);
    } catch {
      setFalhou(true);
    }
  }

  return (
    <div className="meus-mapas">
      <h2 className="meus-mapas-titulo">Meus mapas</h2>
      {erro && <p className="error" role="alert">{erro}</p>}
      {!erro && mapas.length === 0 && <p className="conta-info">Nenhum mapa salvo ainda. Calcule um mapa e clique em “Salvar mapa”.</p>}
      <ul>
        {mapas.map(m => (
          <li key={m.id} aria-current={m.id === atualId || undefined}>
            <button type="button" className="mapa-abrir" onClick={() => onAbrir(m)}>
              <span>{m.nome}</span>
              <small>{detalheMapa(m)}</small>
            </button>
            <button type="button" className="btn-link" onClick={() => apagar(m)} aria-label={`Apagar o mapa de ${m.nome}`}>Apagar</button>
          </li>
        ))}
      </ul>
      <p className="error" role="alert" hidden={!falhou}>Não foi possível apagar. Tente de novo.</p>
    </div>
  );
}
