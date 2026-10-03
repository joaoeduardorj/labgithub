# labgithub

Laboratório para praticar o fluxo de trabalho com Git e GitHub, construindo a calculadora
**Sua idade nas estrelas**: idade, signo, ascendente, fase e signo da Lua no nascimento.

No ar em [labgithub.vercel.app](https://labgithub.vercel.app).

## Como rodar na sua máquina

Precisa do [Node.js](https://nodejs.org) 22 ou mais novo.

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre em http://localhost:5173 e recarrega a cada mudança
npm test         # roda os testes
npm run build    # gera a versão de produção na pasta dist/
```

## Estrutura

```
index.html              ponto de entrada do Vite
src/
  main.jsx              liga o React à página
  App.jsx               layout: formulário à esquerda, resultados à direita
  styles.css            visual "Nocturne"
  components/           partes da tela (Formulario, CampoCidade, Resultados, Cosmos)
  lib/                  cálculos, sem nada de tela — é aqui que ficam os testes
    datas.js            idade, datas e conversão de fuso horário
    astro.js            signo, ascendente, fase e signo da Lua
    cidades.js          busca de cidades (Open-Meteo) e capitais de reserva
    perfil.js           textos do perfil astrológico
    mapa.js             validação do formulário e cálculo do mapa completo
```

## Fluxo de trabalho

1. As mudanças são feitas numa branch criada a partir da `developer`.
2. Um pull request leva a branch para a `developer`, para revisão.
3. Depois de validado, um segundo pull request leva a `developer` para a `main`.

Nada é enviado direto para a `main`. Em cada PR rodam os testes e o build (**CI**), a análise
de segurança (**CodeQL**) e a Vercel publica uma **prévia** com endereço próprio. O que entra
na `main` vai para produção automaticamente.
