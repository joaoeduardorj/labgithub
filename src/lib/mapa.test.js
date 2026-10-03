import { describe, it, expect } from "vitest";
import { validarEntrada, calcularMapa } from "./mapa.js";
import { CAPITAIS, paraLugar } from "./cidades.js";

// "Agora" fixo: os valores esperados abaixo foram gerados pela versão anterior da página
// (index.html em HTML puro) em 03/10/2026, para garantir que a refatoração não mudou nada.
const AGORA = new Date(2026, 9, 3, 12, 0);
const capital = nome => paraLugar(CAPITAIS.find(c => c.name === nome));
const mapa = (nome, nasc, hora, cidade) => {
  const r = validarEntrada({ nome, nasc, hora, lugar: capital(cidade) }, AGORA);
  expect(r.erro).toBeUndefined();
  return calcularMapa(r.dados, AGORA);
};
const textoPerfil = m => m.perfil.map(t => t.texto).join("");

describe("calcularMapa — mesmos resultados da versão anterior", () => {
  it("Recife, 15/07/1990, 08:30", () => {
    const m = mapa("Maria Teste Silva", "1990-07-15", "08:30", "Recife");
    expect(m.idade).toMatchObject({ texto: "36 anos", exata: "36 anos, 2 meses e 18 dias", diasVividos: "13.229", proxAniversario: "285", proxAniversarioSub: "dias" });
    expect(m.signo.nome).toBe("Câncer");
    expect(m.signo.meta).toBe("21/06 a 22/07 · Água");
    expect(m.ascendente.meta).toBe("7° de Virgem · Terra");
    expect(m.lua).toEqual({
      nome: "Quarto Minguante", meta: "50% iluminada · minguando", signo: "Lua em Áries (22°)",
      desenho: "M0 -20 A20 20 0 0 1 0 20 A0.04 20 0 0 0 0 -20Z",
    });
    expect(m.nascimento).toEqual({ diaSemana: "domingo", detalhe: "15/07/1990, às 08:30 · Recife" });
    expect(m.nota).toBeNull();
    expect(textoPerfil(m)).toBe("Com o Sol em Câncer, Maria tem um jeito acolhedor e intuitivo, com forte ligação com a família, a casa e as memórias. O ascendente em Virgem mostra um jeito discreto, observador e prestativo logo no primeiro contato. Com a Lua em Áries, as emoções surgem rápidas e intensas, e passam com a mesma rapidez. E quem nasce na fase Quarto Minguante tende a questionar o que está estabelecido e a buscar novos caminhos.");
  });

  it("São Paulo, 29/02/2000, 23:50 (bissexto)", () => {
    const m = mapa("João Bissexto Lima", "2000-02-29", "23:50", "São Paulo");
    expect(m.idade).toMatchObject({ exata: "26 anos, 7 meses e 4 dias", diasVividos: "9.713", proxAniversario: "148" });
    expect(m.signo.nome).toBe("Peixes");
    expect(m.ascendente.meta).toBe("16° de Sagitário · Fogo");
    expect(m.lua.nome).toBe("Lua Minguante");
    expect(m.lua.meta).toBe("24% iluminada · minguando");
    expect(m.lua.signo).toBe("Lua em Capricórnio (12°)");
    expect(m.lua.desenho).toBe("M0 -20 A20 20 0 0 1 0 20 A10.55 20 0 0 0 0 -20Z");
    expect(m.nascimento.diaSemana).toBe("terça-feira");
    expect(m.nota).toMatch(/29 de fevereiro/);
  });

  it("Porto Alegre, 21/12/1985, 14:00 (horário de verão)", () => {
    const m = mapa("Ana Sul Souza", "1985-12-21", "14:00", "Porto Alegre");
    expect(m.idade.exata).toBe("40 anos, 9 meses e 12 dias");
    expect(m.signo.nome).toBe("Sagitário");
    expect(m.ascendente.meta).toBe("7° de Áries · Fogo");
    expect(m.lua.meta).toBe("74% iluminada · crescendo");
    expect(m.lua.signo).toBe("Lua em Áries (28°)");
    expect(m.lua.desenho).toBe("M0 -20 A20 20 0 0 0 0 20 A9.56 20 0 0 0 0 -20Z");
    expect(m.nascimento.diaSemana).toBe("sábado");
  });

  it("Manaus, 05/01/1975, 03:15 (fuso -4)", () => {
    const m = mapa("Carlos Norte Reis", "1975-01-05", "03:15", "Manaus");
    expect(m.idade).toMatchObject({ exata: "51 anos, 8 meses e 28 dias", diasVividos: "18.899", proxAniversario: "94" });
    expect(m.signo.meta).toBe("22/12 a 19/01 · Terra");
    expect(m.ascendente.meta).toBe("6° de Sagitário · Fogo");
    expect(m.lua.signo).toBe("Lua em Libra (20°)");
    expect(m.lua.meta).toBe("45% iluminada · minguando");
  });

  it("mostra a nota de aniversário quando é hoje", () => {
    const m = mapa("Ana Hoje Silva", "1990-10-03", "10:00", "Recife");
    expect(m.idade.proxAniversario).toBe("Hoje!");
    expect(m.nota).toBe("Hoje é o seu aniversário, Ana. Parabéns pelos 36!");
  });
});

describe("validarEntrada", () => {
  const ok = { nome: "Maria Silva", nasc: "1990-07-15", hora: "08:30", lugar: capital("Recife") };
  const campo = entrada => validarEntrada({ ...ok, ...entrada }, AGORA);

  it("aceita uma entrada completa e calcula o instante em UTC", () => {
    const r = campo({});
    expect(r.dados.utc).toBe(Date.UTC(1990, 6, 15, 11, 30)); // Recife é UTC-3
    expect(r.dados.nome).toBe("Maria Silva");
  });
  it("exige nome e sobrenome", () => {
    expect(campo({ nome: "" })).toEqual({ erro: "Digite seu nome.", campo: "nome" });
    expect(campo({ nome: "Maria" }).campo).toBe("nome");
  });
  it("recusa datas inválidas, futuras ou antigas demais", () => {
    expect(campo({ nasc: "2001-02-29" }).campo).toBe("nasc");
    expect(campo({ nasc: "2027-01-01" }).erro).toMatch(/futuro/);
    expect(campo({ nasc: "1880-01-01" }).erro).toMatch(/130 anos/);
  });
  it("exige hora e cidade escolhida na lista", () => {
    expect(campo({ hora: "" }).campo).toBe("hora");
    expect(campo({ lugar: null }).erro).toBe("Informe a cidade de nascimento.");
    expect(campo({ lugar: null, textoCidade: "Recif" }).erro).toBe("Escolha a cidade na lista de sugestões.");
  });
  it("recusa hora no futuro no dia de hoje", () => {
    expect(campo({ nasc: "2026-10-03", hora: "23:00" }).campo).toBe("hora");
  });
});
