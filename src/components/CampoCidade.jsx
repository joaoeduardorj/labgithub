import { useEffect, useRef, useState } from "react";
import { buscarCidades, paraLugar } from "../lib/cidades.js";

// Campo com autocompletar de cidades (padrão "combobox" de acessibilidade).
// A cidade só vale quando escolhida na lista: aí `onEscolher` recebe o lugar; ao digitar, recebe null.
export default function CampoCidade({ texto, onTexto, onEscolher, invalido, inputRef }) {
  const [aberta, setAberta] = useState(false);
  const [opcoes, setOpcoes] = useState([]);
  const [info, setInfo] = useState("");
  const [ativa, setAtiva] = useState(-1);
  const busca = useRef(null);
  const listaRef = useRef(null);

  // Busca 300 ms depois da última tecla; cancela a busca anterior se o texto mudar.
  useEffect(() => {
    if (!busca.current) return;
    const q = busca.current;
    const ctrl = new AbortController();
    const espera = setTimeout(async () => {
      setInfo("Buscando…"); setOpcoes([]); setAtiva(-1); setAberta(true);
      try {
        const r = await buscarCidades(q, { signal: ctrl.signal });
        setOpcoes(r.opcoes);
        setInfo(r.opcoes.length ? "" : r.reserva
          ? "A busca de cidades está indisponível agora. Escolha a capital mais próxima do seu local de nascimento."
          : "Nenhuma cidade encontrada.");
      } catch { /* busca cancelada */ }
    }, 300);
    return () => { clearTimeout(espera); ctrl.abort(); };
  }, [texto]);

  useEffect(() => {
    if (ativa >= 0) listaRef.current?.querySelector(`#op-${ativa}`)?.scrollIntoView({ block: "nearest" });
  }, [ativa]);

  function fechar() { setAberta(false); setOpcoes([]); setInfo(""); setAtiva(-1); }

  function aoDigitar(e) {
    const valor = e.target.value;
    onTexto(valor);
    onEscolher(null);
    const q = valor.trim();
    busca.current = q.length >= 2 ? q : null;
    if (!busca.current) fechar();
  }

  function escolher(i) {
    const lugar = paraLugar(opcoes[i]);
    busca.current = null;
    onTexto(lugar.rotulo);
    onEscolher(lugar);
    fechar();
  }

  function aoTeclar(e) {
    if (!aberta || !opcoes.length) { if (e.key === "Escape") fechar(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setAtiva(a => (a + (e.key === "ArrowDown" ? 1 : -1) + opcoes.length) % opcoes.length);
    } else if (e.key === "Enter" && ativa >= 0) {
      e.preventDefault(); escolher(ativa);
    } else if (e.key === "Escape") fechar();
  }

  return (
    <div className="field combo">
      <label htmlFor="cidade">Cidade de nascimento</label>
      <input
        id="cidade" name="cidade" className="input" type="text" autoComplete="off" ref={inputRef}
        placeholder="Comece a digitar e escolha na lista"
        role="combobox" aria-autocomplete="list" aria-expanded={aberta} aria-controls="sugestoes"
        aria-activedescendant={ativa >= 0 ? `op-${ativa}` : undefined}
        aria-describedby="erro" aria-invalid={invalido}
        value={texto} onChange={aoDigitar} onKeyDown={aoTeclar} onBlur={() => setTimeout(fechar, 100)}
      />
      <ul id="sugestoes" className="sugestoes" role="listbox" aria-label="Cidades encontradas" hidden={!aberta} ref={listaRef}>
        {info && <li className="info">{info}</li>}
        {opcoes.map((c, i) => (
          <li
            key={`${c.name}-${c.latitude}-${c.longitude}`} id={`op-${i}`} role="option" aria-selected={i === ativa}
            onMouseDown={e => { e.preventDefault(); escolher(i); }}
          >
            {c.name}
            <small>{[c.admin1, c.country].filter(Boolean).join(", ")}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
