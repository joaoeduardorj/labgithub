import { describe, it, expect } from "vitest";
import { paraLinha, deLinha, detalheMapa } from "./mapasSalvos.js";
import { validarEntrada, calcularMapa } from "./mapa.js";
import { CAPITAIS, paraLugar } from "./cidades.js";

const AGORA = new Date(2026, 9, 3, 12, 0);
const recife = paraLugar(CAPITAIS.find(c => c.name === "Recife"));
const dados = validarEntrada({ nome: "Maria Teste Silva", nasc: "1990-07-15", hora: "08:30", lugar: recife }, AGORA).dados;

describe("paraLinha", () => {
  it("monta a linha da tabela mapas, sem user_id", () => {
    expect(paraLinha(dados)).toEqual({
      nome: "Maria Teste Silva",
      data_nascimento: "1990-07-15",
      hora_nascimento: "08:30",
      cidade: "Recife",
      latitude: -8.0476,
      longitude: -34.877,
      fuso: "America/Recife",
    });
  });
});

describe("deLinha", () => {
  // O Postgres devolve a hora com segundos ("08:30:00").
  const linha = { ...paraLinha(dados), hora_nascimento: "08:30:00", id: "abc", criado_em: "2026-10-04T12:00:00Z" };

  it("refaz os dados do formulário a partir da linha salva", () => {
    const d = deLinha(linha);
    expect(d.nome).toBe("Maria Teste Silva");
    expect(d.hora).toBe("08:30");
    expect(d.nasc).toEqual(dados.nasc);
    expect(d.utc).toBe(dados.utc);
    expect(d.lugar).toMatchObject({ nome: "Recife", lat: -8.0476, lon: -34.877, tz: "America/Recife" });
  });

  it("salvar e abrir de novo dá o mesmo mapa", () => {
    const original = calcularMapa(dados, AGORA);
    const reaberto = calcularMapa(deLinha(linha), AGORA);
    expect(reaberto.signo).toEqual(original.signo);
    expect(reaberto.ascendente).toEqual(original.ascendente);
    expect(reaberto.lua).toEqual(original.lua);
    expect(reaberto.idade).toEqual(original.idade);
  });

  it("devolve null para linha incompleta", () => {
    expect(deLinha({ ...linha, data_nascimento: "1990-02-30" })).toBeNull();
    expect(deLinha({ ...linha, hora_nascimento: null })).toBeNull();
    expect(deLinha({ ...linha, fuso: "" })).toBeNull();
  });
});

describe("detalheMapa", () => {
  it("formata data, hora e cidade", () => {
    expect(detalheMapa({ data_nascimento: "1990-07-15", hora_nascimento: "08:30:00", cidade: "Recife" }))
      .toBe("15/07/1990 às 08:30 · Recife");
  });
});
