// Datas e idade. Todas as datas de nascimento são "datas locais" (meia-noite no fuso do navegador).

export const DAY = 86400000;
export const SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export const fmt = n => n.toLocaleString("pt-BR");
export const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
export const pad = n => String(n).padStart(2, "0");

export function hoje(agora = new Date()) {
  return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
}

// "2000-02-29" -> Date local; null se a data não existir (ex.: 2001-02-29).
export function parseISO(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 ? d : null;
}

function diasNoMes(y, m) { return new Date(y, m + 1, 0).getDate(); }

// Nascidos em 29/02 comemoram em 28/02 nos anos não bissextos.
export function aniversarioEm(nasc, ano) {
  const dia = Math.min(nasc.getDate(), diasNoMes(ano, nasc.getMonth()));
  return new Date(ano, nasc.getMonth(), dia);
}

export function calcularIdade(nasc, ref) {
  let anos = ref.getFullYear() - nasc.getFullYear();
  if (aniversarioEm(nasc, ref.getFullYear()) > ref) anos--;
  const ultimo = aniversarioEm(nasc, nasc.getFullYear() + anos);
  let meses = 0, cursor = ultimo;
  while (true) {
    const y = ultimo.getFullYear(), m = ultimo.getMonth() + meses + 1;
    const prox = new Date(y, m, Math.min(nasc.getDate(), diasNoMes(y, m)));
    if (prox > ref) break;
    meses++; cursor = prox;
  }
  const dias = Math.round((ref - cursor) / DAY);
  const vividos = Math.round((ref - nasc) / DAY);
  let prox = aniversarioEm(nasc, ref.getFullYear());
  if (prox <= ref) prox = aniversarioEm(nasc, ref.getFullYear() + 1);
  const ateProx = Math.round((prox - ref) / DAY);
  const ehHoje = aniversarioEm(nasc, ref.getFullYear()).getTime() === ref.getTime();
  return { anos, meses, dias, vividos, ateProx, ehHoje };
}

export function diaDaSemana(data) {
  return SEMANA[data.getDay()] + (data.getDay() % 6 ? "-feira" : "");
}

// Converte data e hora locais de um fuso IANA para UTC (ms). O navegador conhece o histórico
// de fusos e de horários de verão, então o resultado vale também para datas antigas.
function offsetFuso(ms, tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric",
  }).formatToParts(new Date(ms)).map(x => [x.type, +x.value]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ms;
}
export function localParaUTC(nasc, h, m, tz) {
  const local = Date.UTC(nasc.getFullYear(), nasc.getMonth(), nasc.getDate(), h, m);
  return local - offsetFuso(local - offsetFuso(local, tz), tz);
}
