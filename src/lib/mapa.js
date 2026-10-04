// Validação do formulário e cálculo do "mapa" completo de uma pessoa.
// Funções puras: recebem tudo por parâmetro (inclusive "agora"), o que facilita testar
// e, mais adiante, salvar o mapa no banco de dados.
import { hoje, parseISO, calcularIdade, localParaUTC, diaDaSemana, plural, fmt, pad } from "./datas.js";
import { signo, ascendente, faseLua, signoLunar, desenhoLua } from "./astro.js";
import { trechosPerfil } from "./perfil.js";

// Entrada: textos do formulário + lugar escolhido (ou null) + texto digitado na cidade.
// Saída: { erro, campo } ou { dados: { nome, nasc, hora, lugar, utc } }.
export function validarEntrada({ nome, nasc, hora, lugar, textoCidade = "" }, agora = new Date()) {
  const nomeLimpo = (nome || "").trim().replace(/\s+/g, " ");
  const data = parseISO(nasc);
  const hj = hoje(agora);
  if (!nomeLimpo) return { erro: "Digite seu nome.", campo: "nome" };
  if (nomeLimpo.split(" ").length < 2) return { erro: "Digite o nome completo, com nome e sobrenome.", campo: "nome" };
  if (!data) return { erro: "Escolha uma data de nascimento válida.", campo: "nasc" };
  if (data > hj) return { erro: "A data de nascimento não pode ser no futuro.", campo: "nasc" };
  if (hj.getFullYear() - data.getFullYear() > 130) return { erro: "Confira o ano: a data informada passa de 130 anos.", campo: "nasc" };
  const hm = /^(\d{2}):(\d{2})/.exec(hora || "");
  if (!hm) return { erro: "Informe a hora de nascimento.", campo: "hora" };
  if (!lugar) {
    return textoCidade.trim()
      ? { erro: "Escolha a cidade na lista de sugestões.", campo: "cidade" }
      : { erro: "Informe a cidade de nascimento.", campo: "cidade" };
  }
  const utc = localParaUTC(data, +hm[1], +hm[2], lugar.tz);
  if (utc > agora.getTime()) return { erro: "A data e a hora de nascimento não podem ser no futuro.", campo: "hora" };
  return { dados: { nome: nomeLimpo, nasc: data, hora: `${hm[1]}:${hm[2]}`, lugar, utc } };
}

// Tudo o que a tela mostra, já calculado e formatado.
export function calcularMapa({ nome, nasc, hora, lugar, utc }, agora = new Date()) {
  const r = calcularIdade(nasc, hoje(agora));
  const primeiro = nome.split(/\s+/)[0];
  const sol = signo(nasc);
  const asc = ascendente(utc, lugar.lat, lugar.lon);
  const lua = faseLua(utc);
  const luaSig = signoLunar(utc);

  let nota = null;
  if (r.ehHoje) nota = `Hoje é o seu aniversário, ${primeiro}. Parabéns pelos ${r.anos}!`;
  else if (nasc.getMonth() === 1 && nasc.getDate() === 29) {
    nota = "Nascimento em 29 de fevereiro: nos anos não bissextos, o aniversário é contado em 28 de fevereiro.";
  }

  return {
    primeiroNome: primeiro,
    idade: {
      anos: r.anos,
      texto: plural(r.anos, "ano", "anos"),
      exata: `${plural(r.anos, "ano", "anos")}, ${plural(r.meses, "mês", "meses")} e ${plural(r.dias, "dia", "dias")}`,
      diasVividos: fmt(r.vividos),
      proxAniversario: r.ehHoje ? "Hoje!" : fmt(r.ateProx),
      proxAniversarioSub: r.ehHoje ? "" : (r.ateProx === 1 ? "dia" : "dias"),
    },
    signo: { ...sol, meta: `${pad(sol.ini[1])}/${pad(sol.ini[0])} a ${sol.fim} · ${sol.elem}` },
    ascendente: { ...asc, meta: `${asc.grau}° de ${asc.nome} · ${asc.elem}` },
    lua: {
      nome: lua.nome,
      meta: `${Math.round(lua.ilum * 100)}% iluminada · ${lua.crescente ? "crescendo" : "minguando"}`,
      signo: `Lua em ${luaSig.nome} (${luaSig.grau}°)`,
      desenho: desenhoLua(lua.ilum, lua.crescente),
    },
    perfil: trechosPerfil(primeiro, sol.nome, asc.nome, luaSig.nome, lua.nome),
    nascimento: {
      diaSemana: diaDaSemana(nasc),
      detalhe: `${nasc.toLocaleDateString("pt-BR")}, às ${hora} · ${lugar.nome}`,
    },
    nota,
  };
}
