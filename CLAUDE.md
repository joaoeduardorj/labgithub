# Regras de trabalho no repositório

## Fluxo de branches e PRs

1. **Crie toda branch nova a partir da `developer`**, sempre atualizada (`git fetch` e depois `git checkout -b <nome> origin/developer`).
2. **Abra o PR da branch de trabalho para a `developer`.**
3. Depois que esse PR for aprovado e mesclado, **abra um PR da `developer` para a `main`.**

## Proibido

- **Nunca envie nada direto para a `main`**: nada de commit nem push na `main`.
- **Nunca faça merge**, nem de PR no GitHub nem `git merge` local entre as branches principais. Quem faz o merge é sempre o usuário.
