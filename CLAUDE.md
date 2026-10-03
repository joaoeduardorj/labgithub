# Regras de trabalho no repositório

## Fluxo de branches e PRs

1. **Crie toda branch nova a partir da `developer`**, sempre atualizada (`git fetch` e depois `git checkout -b <nome> origin/developer`).
2. **Abra o PR da branch de trabalho para a `developer`.**
3. Depois que esse PR for aprovado e mesclado, **abra um PR da `developer` para a `main`.**

## Projeto

- React + Vite. Comandos: `npm install`, `npm run dev`, `npm test`, `npm run build`.
- Cálculos ficam em `src/lib/` como funções puras, com testes ao lado (`*.test.js`).
  Componentes em `src/components/` só exibem; não colocar lógica de cálculo neles.
- Antes de abrir um PR, rode `npm test` e `npm run build`. O CI roda os dois em todo PR.

## Segredos

- Nunca coloque chaves, tokens ou senhas no código nem em arquivos versionados.
- Na máquina local, use `.env.local` (ignorado pelo Git). Na Vercel, use as Environment Variables.

## Proibido

- **Nunca envie nada direto para a `main`**: nada de commit nem push na `main`.
- **Nunca faça merge**, nem de PR no GitHub nem `git merge` local entre as branches principais. Quem faz o merge é sempre o usuário.
