// Cartões de resultado. Recebe o mapa já calculado (ver src/lib/mapa.js) e só exibe.
const SEM_EMOJI = "︎"; // força o símbolo do signo em modo texto, sem virar emoji colorido

export default function Resultados({ mapa }) {
  const { idade, signo, ascendente, lua, perfil, nascimento, nota } = mapa;
  return (
    <div className="results-grid" id="result">
      <div className="result-card large card-age" style={{ "--i": 0 }}>
        <div className="result-label" id="r-ola">Olá, {mapa.primeiroNome}</div>
        <div className="result-value" id="r-anos">{idade.texto}</div>
        <p className="result-sub" id="r-exata">{idade.exata}</p>
      </div>

      <div className="result-card card-signo" id="c-signo" data-elem={signo.elem} style={{ "--i": 1 }}>
        <div className="result-label">Signo</div>
        <div className="glyph" id="r-glifo" aria-hidden="true">{signo.glifo + SEM_EMOJI}</div>
        <div className="result-value text" id="r-signo">{signo.nome}</div>
        <p className="result-sub" id="r-signo-meta">{signo.meta}</p>
      </div>

      <div className="result-card card-signo" id="c-asc" data-elem={ascendente.elem} style={{ "--i": 2 }}>
        <div className="result-label">Ascendente</div>
        <div className="glyph" id="r-asc-glifo" aria-hidden="true">{ascendente.glifo + SEM_EMOJI}</div>
        <div className="result-value text" id="r-asc">{ascendente.nome}</div>
        <p className="result-sub" id="r-asc-meta">{ascendente.meta}</p>
      </div>

      <div className="result-card large card-lua" style={{ "--i": 3 }}>
        <div className="result-label">Lua ao nascer</div>
        <svg className="moon" viewBox="-22 -22 44 44" role="img" aria-labelledby="r-lua">
          <circle className="dark" r="20" />
          <path className="lit" id="r-lua-path" d={lua.desenho} />
          <circle className="rim" r="20" />
        </svg>
        <div className="result-value text" id="r-lua">{lua.nome}</div>
        <p className="result-sub" id="r-lua-meta">{lua.meta}</p>
        <p className="result-sub" id="r-lua-signo">{lua.signo}</p>
      </div>

      <div className="result-card large card-perfil" style={{ "--i": 4 }}>
        <div className="result-label">Seu perfil nas estrelas</div>
        <p className="perfil" id="r-perfil">
          {perfil.map((t, i) => (t.destaque ? <b key={i}>{t.texto}</b> : t.texto))}
        </p>
        <p className="aviso">Interpretação astrológica tradicional, para diversão.</p>
      </div>

      <div className="result-card card-dias" style={{ "--i": 5 }}>
        <div className="result-label">Dias vividos</div>
        <div className="result-value" id="r-dias">{idade.diasVividos}</div>
      </div>

      <div className="result-card card-prox" style={{ "--i": 6 }}>
        <div className="result-label">Próx. aniversário</div>
        <div className="result-value" id="r-prox">{idade.proxAniversario}</div>
        <p className="result-sub" id="r-prox-sub">{idade.proxAniversarioSub}</p>
      </div>

      <div className="result-card large card-sem" style={{ "--i": 7 }}>
        <div className="result-label">Nasceu em</div>
        <div className="result-value text" id="r-sem">{nascimento.diaSemana}</div>
        <p className="result-sub" id="r-data">{nascimento.detalhe}</p>
      </div>

      <p className="note" id="r-nota" hidden={!nota}>{nota}</p>
    </div>
  );
}
