// Cálculos astronômicos e astrológicos (fórmulas de baixa precisão de Jean Meeus).
import { DAY } from "./datas.js";

// Signos pelo calendário tropical. Datas de início usuais no Brasil; nas datas de transição
// o signo pode variar conforme o ano e a hora do nascimento.
export const SIGNOS = [
  { nome: "Capricórnio", glifo: "♑", ini: [12, 22], fim: "19/01", elem: "Terra" },
  { nome: "Aquário",     glifo: "♒", ini: [1, 20],  fim: "18/02", elem: "Ar" },
  { nome: "Peixes",      glifo: "♓", ini: [2, 19],  fim: "20/03", elem: "Água" },
  { nome: "Áries",       glifo: "♈", ini: [3, 21],  fim: "19/04", elem: "Fogo" },
  { nome: "Touro",       glifo: "♉", ini: [4, 20],  fim: "20/05", elem: "Terra" },
  { nome: "Gêmeos",      glifo: "♊", ini: [5, 21],  fim: "20/06", elem: "Ar" },
  { nome: "Câncer",      glifo: "♋", ini: [6, 21],  fim: "22/07", elem: "Água" },
  { nome: "Leão",        glifo: "♌", ini: [7, 23],  fim: "22/08", elem: "Fogo" },
  { nome: "Virgem",      glifo: "♍", ini: [8, 23],  fim: "22/09", elem: "Terra" },
  { nome: "Libra",       glifo: "♎", ini: [9, 23],  fim: "22/10", elem: "Ar" },
  { nome: "Escorpião",   glifo: "♏", ini: [10, 23], fim: "21/11", elem: "Água" },
  { nome: "Sagitário",   glifo: "♐", ini: [11, 22], fim: "21/12", elem: "Fogo" },
];
// Ordem do zodíaco a partir de 0° de Áries, para converter longitude eclíptica em signo.
export const ORDEM = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
                      "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];

const rad = d => d * Math.PI / 180;
const norm = d => ((d % 360) + 360) % 360;
const signoDaLongitude = lam => ({
  ...SIGNOS.find(x => x.nome === ORDEM[Math.floor(lam / 30)]),
  grau: Math.floor(lam % 30),
});

// Signo solar pela data (dia e mês).
export function signo(nasc) {
  const v = (nasc.getMonth() + 1) * 100 + nasc.getDate();
  let atual = SIGNOS[0];
  for (const s of SIGNOS.slice(1)) if (v >= s.ini[0] * 100 + s.ini[1]) atual = s;
  return atual; // antes de 20/01 continua Capricórnio
}

export const FASES = ["Lua Nova", "Lua Crescente", "Quarto Crescente", "Crescente Gibosa",
                      "Lua Cheia", "Minguante Gibosa", "Quarto Minguante", "Lua Minguante"];

function argsLua(utc) {
  const T = (utc / DAY + 2440587.5 - 2451545) / 36525;
  return {
    T,
    D:  norm(297.8501921 + 445267.1114034 * T),
    M:  norm(357.5291092 + 35999.0502909 * T),
    Mp: norm(134.9633964 + 477198.8675055 * T),
    F:  norm(93.2720950 + 483202.0175233 * T),
  };
}

// Fase da lua no instante `utc` (ms): elongação Lua–Sol.
export function faseLua(utc) {
  const { D, M, Mp } = argsLua(utc);
  const E = norm(D + 6.289 * Math.sin(rad(Mp)) - 2.100 * Math.sin(rad(M))
    + 1.274 * Math.sin(rad(2 * D - Mp)) + 0.658 * Math.sin(rad(2 * D))
    + 0.214 * Math.sin(rad(2 * Mp)) + 0.110 * Math.sin(rad(D)));
  const ilum = (1 - Math.cos(rad(E))) / 2;
  return { nome: FASES[Math.floor(norm(E + 22.5) / 45)], ilum, crescente: E < 180, idade: E / 360 * 29.530589 };
}

// Caminho SVG da parte iluminada, como vista do Hemisfério Sul:
// na lua crescente, o lado iluminado fica à esquerda.
export function desenhoLua(ilum, crescente, r = 20) {
  const ladoDireito = !crescente;
  const rx = (r * Math.abs(1 - 2 * ilum)).toFixed(2);
  const arco = ladoDireito ? 1 : 0;
  const term = ilum > 0.5 ? arco : 1 - arco;
  return `M0 ${-r} A${r} ${r} 0 0 ${arco} 0 ${r} A${rx} ${r} 0 0 ${term} 0 ${-r}Z`;
}

// Signo lunar: longitude eclíptica da Lua pelos termos principais da teoria de Meeus
// (precisão de alguns décimos de grau, suficiente para o signo).
export function signoLunar(utc) {
  const { T, D, M, Mp, F } = argsLua(utc);
  const s = x => Math.sin(rad(x));
  const lam = norm(218.3164477 + 481267.88123421 * T
    + 6.289 * s(Mp) + 1.274 * s(2 * D - Mp) + 0.658 * s(2 * D) + 0.214 * s(2 * Mp)
    - 0.186 * s(M) - 0.114 * s(2 * F) + 0.059 * s(2 * D - 2 * Mp) + 0.057 * s(2 * D - M - Mp)
    + 0.053 * s(2 * D + Mp) + 0.046 * s(2 * D - M) + 0.041 * s(Mp - M) - 0.035 * s(D) - 0.031 * s(M + Mp));
  return signoDaLongitude(lam);
}

// Ascendente: grau da eclíptica que nasce no horizonte leste, a partir do tempo sideral
// local e da latitude do local de nascimento.
export function ascendente(utc, lat, lon) {
  const jd = utc / DAY + 2440587.5, T = (jd - 2451545) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - T * T * T / 38710000;
  const ramc = rad(norm(gmst + lon)), eps = rad(23.439291 - 0.0130042 * T), phi = rad(lat);
  const lam = norm(Math.atan2(Math.cos(ramc),
    -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * 180 / Math.PI);
  return signoDaLongitude(lam);
}
