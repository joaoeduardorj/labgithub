// Busca de cidades: serviço gratuito de geocodificação do Open-Meteo (coordenadas e fuso).
// Se o serviço não responder, usa a lista de capitais brasileiras como reserva.

export const CAPITAIS = [
  { name: "Rio Branco", admin1: "Acre", country: "Brasil", latitude: -9.9747, longitude: -67.81, timezone: "America/Rio_Branco" },
  { name: "Maceió", admin1: "Alagoas", country: "Brasil", latitude: -9.6658, longitude: -35.7353, timezone: "America/Maceio" },
  { name: "Macapá", admin1: "Amapá", country: "Brasil", latitude: 0.0349, longitude: -51.0694, timezone: "America/Belem" },
  { name: "Manaus", admin1: "Amazonas", country: "Brasil", latitude: -3.119, longitude: -60.0217, timezone: "America/Manaus" },
  { name: "Salvador", admin1: "Bahia", country: "Brasil", latitude: -12.9714, longitude: -38.5014, timezone: "America/Bahia" },
  { name: "Fortaleza", admin1: "Ceará", country: "Brasil", latitude: -3.7172, longitude: -38.5433, timezone: "America/Fortaleza" },
  { name: "Brasília", admin1: "Distrito Federal", country: "Brasil", latitude: -15.7939, longitude: -47.8828, timezone: "America/Sao_Paulo" },
  { name: "Vitória", admin1: "Espírito Santo", country: "Brasil", latitude: -20.3155, longitude: -40.3128, timezone: "America/Sao_Paulo" },
  { name: "Goiânia", admin1: "Goiás", country: "Brasil", latitude: -16.6869, longitude: -49.2648, timezone: "America/Sao_Paulo" },
  { name: "São Luís", admin1: "Maranhão", country: "Brasil", latitude: -2.5307, longitude: -44.3068, timezone: "America/Fortaleza" },
  { name: "Cuiabá", admin1: "Mato Grosso", country: "Brasil", latitude: -15.6014, longitude: -56.0979, timezone: "America/Cuiaba" },
  { name: "Campo Grande", admin1: "Mato Grosso do Sul", country: "Brasil", latitude: -20.4697, longitude: -54.6201, timezone: "America/Campo_Grande" },
  { name: "Belo Horizonte", admin1: "Minas Gerais", country: "Brasil", latitude: -19.9167, longitude: -43.9345, timezone: "America/Sao_Paulo" },
  { name: "Belém", admin1: "Pará", country: "Brasil", latitude: -1.4558, longitude: -48.4902, timezone: "America/Belem" },
  { name: "João Pessoa", admin1: "Paraíba", country: "Brasil", latitude: -7.1195, longitude: -34.845, timezone: "America/Fortaleza" },
  { name: "Curitiba", admin1: "Paraná", country: "Brasil", latitude: -25.4284, longitude: -49.2733, timezone: "America/Sao_Paulo" },
  { name: "Recife", admin1: "Pernambuco", country: "Brasil", latitude: -8.0476, longitude: -34.877, timezone: "America/Recife" },
  { name: "Teresina", admin1: "Piauí", country: "Brasil", latitude: -5.0892, longitude: -42.8019, timezone: "America/Fortaleza" },
  { name: "Rio de Janeiro", admin1: "Rio de Janeiro", country: "Brasil", latitude: -22.9068, longitude: -43.1729, timezone: "America/Sao_Paulo" },
  { name: "Natal", admin1: "Rio Grande do Norte", country: "Brasil", latitude: -5.7945, longitude: -35.211, timezone: "America/Fortaleza" },
  { name: "Porto Alegre", admin1: "Rio Grande do Sul", country: "Brasil", latitude: -30.0346, longitude: -51.2177, timezone: "America/Sao_Paulo" },
  { name: "Porto Velho", admin1: "Rondônia", country: "Brasil", latitude: -8.7612, longitude: -63.9004, timezone: "America/Porto_Velho" },
  { name: "Boa Vista", admin1: "Roraima", country: "Brasil", latitude: 2.8235, longitude: -60.6758, timezone: "America/Boa_Vista" },
  { name: "Florianópolis", admin1: "Santa Catarina", country: "Brasil", latitude: -27.5954, longitude: -48.548, timezone: "America/Sao_Paulo" },
  { name: "São Paulo", admin1: "São Paulo", country: "Brasil", latitude: -23.5505, longitude: -46.6333, timezone: "America/Sao_Paulo" },
  { name: "Aracaju", admin1: "Sergipe", country: "Brasil", latitude: -10.9472, longitude: -37.0731, timezone: "America/Maceio" },
  { name: "Palmas", admin1: "Tocantins", country: "Brasil", latitude: -10.2491, longitude: -48.3243, timezone: "America/Araguaina" },
];

const semAcento = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function capitaisPorNome(q) {
  const b = semAcento(q);
  return CAPITAIS.filter(c => semAcento(c.name).includes(b) || semAcento(c.admin1).includes(b));
}

// Devolve { opcoes, reserva }: reserva = true quando veio da lista de capitais.
export async function buscarCidades(q, { signal, fetchFn = fetch } = {}) {
  try {
    const resp = await fetchFn(
      "https://geocoding-api.open-meteo.com/v1/search?count=6&language=pt&format=json&name=" + encodeURIComponent(q),
      { signal },
    );
    if (!resp.ok) throw new Error(resp.status);
    const dados = await resp.json();
    return { opcoes: (dados.results || []).filter(c => c.timezone), reserva: false };
  } catch (e) {
    if (e.name === "AbortError") throw e;
    return { opcoes: capitaisPorNome(q), reserva: true };
  }
}

// Converte uma opção da busca no "lugar" usado pelos cálculos.
export const paraLugar = c => ({
  nome: c.name, lat: c.latitude, lon: c.longitude, tz: c.timezone,
  rotulo: [c.name, c.admin1 || c.country].filter(Boolean).join(", "),
});
