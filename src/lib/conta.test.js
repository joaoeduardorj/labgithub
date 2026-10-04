import { describe, it, expect } from "vitest";
import { validarEmail } from "./conta.js";

describe("validarEmail", () => {
  it("aceita e-mail válido e normaliza espaços e maiúsculas", () => {
    expect(validarEmail("  Maria.Silva@Exemplo.com ")).toEqual({ email: "maria.silva@exemplo.com" });
  });

  it("pede o e-mail quando o campo está vazio", () => {
    expect(validarEmail("")).toEqual({ erro: "Digite seu e-mail." });
    expect(validarEmail("   ")).toEqual({ erro: "Digite seu e-mail." });
    expect(validarEmail(undefined)).toEqual({ erro: "Digite seu e-mail." });
  });

  it("recusa e-mail incompleto", () => {
    for (const t of ["maria", "maria@", "maria@exemplo", "@exemplo.com", "maria silva@exemplo.com"]) {
      expect(validarEmail(t).erro).toBe("Confira o e-mail: ele parece incompleto.");
    }
  });
});
