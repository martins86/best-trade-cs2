# Quickstart: Refactor do Layout Angular

Este guia valida o layout sem dependências externas ou dados de mercado reais.

## Pré-requisitos

- Node.js compatível com Angular 22
- Dependências instaladas em `frontend/`
- Navegador moderno com suporte a tema claro e escuro

## Executar

```bash
cd frontend
npm ci
npm start
```

Abra a URL informada pelo Angular CLI e navegue para `/opportunities`.

## Cenários de aceitação

1. Confirme que o shell apresenta sidebar em desktop e menu ou navegação compacta em celular.
2. Confirme que destinos futuros não são apresentados como páginas implementadas.
3. Alterne para tema claro e escuro e recarregue: a preferência escolhida deve permanecer ativa.
4. Navegue por teclado com abas ou navegação padrão e confirme foco visível em todos os controles.
5. Consulte a tabela em desktop, tablet e celular: a mesma skin, direção e liquidez devem permanecer legíveis.
6. Use pesquisa, direção, liquidez mínima e margem mínima em combinação e confirme que todos os critérios são aplicados.
7. Informe custo mínimo maior que custo máximo e confirme a mensagem de faixa inválida sem resultado filtrado.
8. Limpe os filtros e confirme a restauração da coleção local inicial.
9. Abra uma comparação Steam → CSFloat e depois CSFloat → Steam.
10. Confirme que cada linha com venda na Steam identifica crédito não sacável, nunca dinheiro disponível.
11. Confirme que dados negativos e nulos continuam visíveis e são identificados como não lucrativos.
12. Confirme que cenários incompletos, desatualizados ou não equivalentes não exibem cálculo válido.
13. No tema escuro, confirme que ícones da sidebar e toolbar renderizam como glifos Material e não como nomes de ligadura.
14. Abra uma comparação no tema escuro e confirme que card, blocos de compra/venda, rótulos e valores permanecem escuros e legíveis.

## Validar testes

```bash
cd frontend
npm test
npm run build
npx playwright test
```

Os testes devem cobrir tema, shell responsivo, filtros, estados da tabela e navegação até o detalhe.

## Verificação visual

Compare a implementação com `docs/cs2-market-manager-layout.html` quanto a:

- Densidade e hierarquia das superfícies.
- Sidebar, cabeçalho, indicadores e tabela.
- Tema claro e escuro.
- Menu móvel e rolagem horizontal controlada.
- Espaçamento e legibilidade em 320 px, 768 px e 1440 px.

## Resultado esperado

A interface adota o visual operacional da referência sem transformar dados simulados em dados reais. Todas as rotas de descoberta e detalhe continuam funcionais, os cálculos existentes permanecem intactos e nenhum módulo futuro recebe implementação fora do escopo.
