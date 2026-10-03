// Regras da conta, sem nada de tela nem de rede.

// Entrada: texto digitado no campo de e-mail. Saída: { erro } ou { email } já limpo.
export function validarEmail(texto) {
  const email = (texto || "").trim().toLowerCase();
  if (!email) return { erro: "Digite seu e-mail." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erro: "Confira o e-mail: ele parece incompleto." };
  return { email };
}
