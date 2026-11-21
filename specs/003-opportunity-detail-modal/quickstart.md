# Quickstart: Modal de Detalhes das Oportunidades

## Pré-requisitos

```bash
cd frontend
npm ci
```

## Executar

```bash
npm start
```

Abra `/opportunities` no navegador.

## Cenários de validação

1. Aplique pesquisa ou outro filtro e abra o detalhe de uma linha válida.
2. Confirme que a coluna de ações mostra apenas um ícone, sem texto visível `Detalhes`.
3. Confirme que o ícone possui nome acessível associado à skin.
4. Confirme que a URL continua `/opportunities` após abrir e fechar a modal.
5. Defina pesquisa `AWP`, direção `Steam → CSFloat` e ordenação por resultado; confirme que filtros, ordenação e tema permanecem iguais após fechar.
6. Abra uma comparação Steam → CSFloat e outra CSFloat → Steam.
7. Confirme que CSFloat → Steam identifica crédito Steam não sacável.
8. Feche pelo botão, por Escape e clicando no backdrop.
9. Abra com Enter, navegue com Tab, feche com Escape e confirme o retorno do foco ao botão acionador.
10. Repita em 320 px, 768 px e 1440 px; confirme que os limites do diálogo ficam dentro da viewport e que conteúdo excedente pode rolar.
11. Valide os temas claro e escuro e confirme que o backdrop escurece visualmente o conteúdo atrás da modal.

## Testes

```bash
npm test
npm run build
npx playwright test
```

O teste deve cobrir ação por ícone, contexto da modal, estados inválidos, foco, preservação da rota e responsividade.
