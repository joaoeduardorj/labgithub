import { describe, it, expect } from "vitest";
import { buscarCidades, capitaisPorNome, paraLugar } from "./cidades.js";

describe("busca de cidades", () => {
  it("usa o serviço externo quando ele responde", async () => {
    const fetchFn = async () => ({
      ok: true,
      json: async () => ({ results: [
        { name: "Olinda", admin1: "Pernambuco", country: "Brasil", latitude: -8, longitude: -34.85, timezone: "America/Recife" },
        { name: "Sem fuso", latitude: 0, longitude: 0 },
      ] }),
    });
    const r = await buscarCidades("olinda", { fetchFn });
    expect(r.reserva).toBe(false);
    expect(r.opcoes.map(c => c.name)).toEqual(["Olinda"]); // descarta resultados sem fuso
  });

  it("cai para as capitais quando o serviço falha", async () => {
    const fetchFn = async () => { throw new TypeError("Failed to fetch"); };
    const r = await buscarCidades("recif", { fetchFn });
    expect(r.reserva).toBe(true);
    expect(r.opcoes.map(c => c.name)).toEqual(["Recife"]);
  });

  it("procura capitais sem acento e também pelo estado", () => {
    expect(capitaisPorNome("sao paulo").map(c => c.name)).toEqual(["São Paulo"]);
    expect(capitaisPorNome("amazonas").map(c => c.name)).toEqual(["Manaus"]);
  });

  it("monta o rótulo do lugar escolhido", () => {
    expect(paraLugar(capitaisPorNome("recife")[0]).rotulo).toBe("Recife, Pernambuco");
  });
});
