// Interpretações astrológicas tradicionais, escritas sem marcar gênero.

export const PERFIL_SOL = {
  "Áries": "tem energia de sobra, coragem para começar coisas novas e um jeito direto e competitivo",
  "Touro": "busca estabilidade e conforto, com paciência, persistência e gosto pelos prazeres da vida",
  "Gêmeos": "tem a mente curiosa e ágil, adora conversar, aprender e circular entre ideias e pessoas",
  "Câncer": "tem um jeito acolhedor e intuitivo, com forte ligação com a família, a casa e as memórias",
  "Leão": "tem brilho próprio, generosidade e criatividade, e gosta de se expressar com o coração",
  "Virgem": "tem olhar atento aos detalhes, senso prático e vontade genuína de ser útil e fazer bem feito",
  "Libra": "busca harmonia e equilíbrio, com charme, senso estético e talento para a diplomacia",
  "Escorpião": "tem intensidade e profundidade, intuição aguçada e grande capacidade de se transformar",
  "Sagitário": "tem espírito livre e otimista, sede de conhecimento e paixão por novos horizontes",
  "Capricórnio": "tem ambição, disciplina e senso de responsabilidade, e constrói seus objetivos passo a passo",
  "Aquário": "tem pensamento original e independente, valoriza a liberdade e se importa com causas coletivas",
  "Peixes": "tem sensibilidade, imaginação e empatia, com forte ligação com os sonhos e a arte",
};
export const PERFIL_ASC = {
  "Áries": "dá uma primeira impressão de energia e iniciativa, de quem age rápido e vai direto ao ponto",
  "Touro": "transmite calma e confiabilidade, com uma presença serena e agradável",
  "Gêmeos": "traz um jeito comunicativo e espirituoso, que puxa conversa com facilidade",
  "Câncer": "transmite doçura e receptividade, e faz os outros se sentirem à vontade",
  "Leão": "garante uma presença marcante e calorosa, difícil de passar despercebida",
  "Virgem": "mostra um jeito discreto, observador e prestativo logo no primeiro contato",
  "Libra": "traz elegância e simpatia, com um jeito gentil de lidar com as pessoas",
  "Escorpião": "dá um ar magnético e reservado, que desperta curiosidade",
  "Sagitário": "transmite entusiasmo e bom humor, com um jeito franco e aventureiro",
  "Capricórnio": "passa a imagem de alguém sério, maduro e focado no que quer",
  "Aquário": "mostra um jeito original e amigável, às vezes um pouco fora do comum",
  "Peixes": "transmite suavidade e empatia, com um ar sonhador",
};
export const PERFIL_LUA = {
  "Áries": "as emoções surgem rápidas e intensas, e passam com a mesma rapidez",
  "Touro": "a segurança emocional vem da estabilidade, do carinho e das rotinas tranquilas",
  "Gêmeos": "conversar e trocar ideias é o caminho para entender o que sente",
  "Câncer": "sente tudo profundamente e cuida de quem ama com dedicação",
  "Leão": "precisa de afeto e reconhecimento, e demonstra o que sente com generosidade",
  "Virgem": "lida com as emoções de forma prática e cuida dos outros nos pequenos detalhes",
  "Libra": "busca paz nas relações e se sente bem quando há equilíbrio ao redor",
  "Escorpião": "vive as emoções com intensidade e guarda os sentimentos mais profundos para poucos",
  "Sagitário": "precisa de liberdade e otimismo para se sentir bem, e foge de climas pesados",
  "Capricórnio": "costuma guardar as emoções e demonstra afeto por meio de atitudes",
  "Aquário": "precisa de espaço próprio e lida com os sentimentos de forma racional e independente",
  "Peixes": "tem grande sensibilidade, absorve o clima ao redor e se emociona com facilidade",
};
export const PERFIL_FASE = {
  "Lua Nova": "costuma ter espírito pioneiro e gosta de começar projetos do zero",
  "Lua Crescente": "tende a ter muita vontade de crescer e de superar obstáculos",
  "Quarto Crescente": "costuma enfrentar os desafios de frente e tomar decisões com firmeza",
  "Crescente Gibosa": "tende a buscar aperfeiçoamento constante e a lapidar tudo o que faz",
  "Lua Cheia": "tende a viver tudo com intensidade e a dar grande valor aos relacionamentos",
  "Minguante Gibosa": "costuma gostar de compartilhar o que aprende e de ensinar os outros",
  "Quarto Minguante": "tende a questionar o que está estabelecido e a buscar novos caminhos",
  "Lua Minguante": "costuma ter uma sabedoria introspectiva e facilidade para deixar o passado para trás",
};

// Texto do perfil em trechos; `destaque: true` marca o que aparece em negrito.
export function trechosPerfil(nome, sol, asc, luaSig, fase) {
  return [
    { texto: "Com o " }, { texto: `Sol em ${sol}`, destaque: true },
    { texto: `, ${nome} ${PERFIL_SOL[sol]}. O ` },
    { texto: `ascendente em ${asc}`, destaque: true }, { texto: ` ${PERFIL_ASC[asc]}. Com a ` },
    { texto: `Lua em ${luaSig}`, destaque: true }, { texto: `, ${PERFIL_LUA[luaSig]}. E quem nasce na fase ` },
    { texto: fase, destaque: true }, { texto: ` ${PERFIL_FASE[fase]}.` },
  ];
}
