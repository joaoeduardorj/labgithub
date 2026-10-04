// Conversão entre os dados do formulário e as linhas da tabela `mapas` do Supabase.
// Funções puras: nada de rede aqui (as chamadas ficam em src/hooks/useMapas.js).
import { parseISO, localParaUTC, pad } from "./datas.js";

// Dados validados do formulário -> linha para inserir. `user_id` fica de fora:
// o banco preenche com quem está logado (default auth.uid()).
export function paraLinha({ nome, nasc, hora, lugar }) {
  return {
    nome,
    data_nascimento: `${nasc.getFullYear()}-${pad(nasc.getMonth() + 1)}-${pad(nasc.getDate())}`,
    hora_nascimento: hora,
    cidade: lugar.nome,
    latitude: lugar.lat,
    longitude: lugar.lon,
    fuso: lugar.tz,
  };
}

// Linha salva -> os mesmos dados que validarEntrada entrega, prontos para calcularMapa.
// Devolve null se a linha estiver incompleta.
export function deLinha(linha) {
  const nasc = parseISO(linha.data_nascimento);
  const hm = /^(\d{2}):(\d{2})/.exec(linha.hora_nascimento || "");
  if (!nasc || !hm || !linha.fuso) return null;
  const lugar = { nome: linha.cidade, lat: linha.latitude, lon: linha.longitude, tz: linha.fuso, rotulo: linha.cidade };
  return {
    nome: linha.nome,
    nasc,
    hora: `${hm[1]}:${hm[2]}`,
    lugar,
    utc: localParaUTC(nasc, +hm[1], +hm[2], linha.fuso),
  };
}

// Texto de apoio na lista "Meus mapas": "15/07/1990 às 08:30 · Recife".
export function detalheMapa(linha) {
  const [a, m, d] = linha.data_nascimento.split("-");
  return `${d}/${m}/${a} às ${linha.hora_nascimento.slice(0, 5)} · ${linha.cidade}`;
}
