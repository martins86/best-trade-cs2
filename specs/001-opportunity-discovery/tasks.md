---

description: "Task list for simulated opportunity discovery"
---

# Tasks: Descoberta de Oportunidades Simuladas

**Input**: Design documents from `specs/001-opportunity-discovery/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`. Não há `contracts/` porque a feature não expõe interfaces externas.

**Tests**: Incluídos porque a constituição exige testes automatizados para cálculos e filtros críticos. Para cada história, escreva os testes antes da implementação e confirme que falham pelo comportamento ainda ausente.

**Organization**: Tarefas agrupadas por história do usuário para permitir implementação e validação incremental.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criar e configurar o projeto Angular necessário para a feature.

- [X] T001 Inicializar a aplicação Angular 22 standalone com roteamento e estilos SCSS em `frontend/package.json` e `frontend/angular.json`.
- [X] T002 Instalar Angular Material 22, Decimal.js e configurar Vitest com utilitários de teste Angular em `frontend/package.json`, `frontend/angular.json` e `frontend/src/test.ts` (depende de T001).
- [X] T003 Instalar Playwright e configurar execução E2E com servidor local em `frontend/package.json` e `frontend/playwright.config.ts` (depende de T002).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir os tipos de domínio compartilhados por todas as histórias. Todas as tarefas desta fase devem terminar antes das histórias.

- [X] T004 Definir tipos compartilhados de marketplace, moeda, direção, categoria de liquidez, estado de dados e tipo de valor recebido em `frontend/src/app/features/opportunities/domain/opportunity-types.ts` (depende de T001).
- [X] T005 [P] Definir `SkinIdentity` e `Sticker` em `frontend/src/app/features/opportunities/domain/skin-identity.model.ts`, respeitando `data-model.md`: `SkinIdentity.id`, `SkinIdentity.marketHashName`, `SkinIdentity.category`, `SkinIdentity.wear`, `SkinIdentity.statTrak`, `SkinIdentity.souvenir`, `SkinIdentity.floatValue`, `SkinIdentity.paintSeed`, `SkinIdentity.stickers`, `SkinIdentity.specialAttributes`, `Sticker.name` e `Sticker.slot` (depende de T004).
- [X] T006 [P] Definir `PriceReference` e `FeeCost` em `frontend/src/app/features/opportunities/domain/price-reference.model.ts`, respeitando `data-model.md`: `PriceReference.id`, `PriceReference.skinIdentityId`, `PriceReference.marketplace`, `PriceReference.price`, `PriceReference.currency`, `PriceReference.collectedAt`, `PriceReference.volume24h`, `PriceReference.salesFrequency`, `PriceReference.spreadPercent`, `PriceReference.activeListings`, `PriceReference.fees`, `FeeCost.kind`, `FeeCost.amount`, `FeeCost.currency`, `FeeCost.label` e `FeeCost.appliesTo` (depende de T004).
- [X] T007 [P] Definir `FxQuote` em `frontend/src/app/features/opportunities/domain/fx-quote.model.ts`, respeitando `data-model.md`: `FxQuote.baseCurrency`, `FxQuote.quoteCurrency`, `FxQuote.rate` e `FxQuote.referenceTime` (depende de T004).
- [X] T008 Definir `OpportunityScenario` e estados derivados em `frontend/src/app/features/opportunities/domain/opportunity-scenario.model.ts`, respeitando `data-model.md`: `OpportunityScenario.skinIdentityId`, `OpportunityScenario.direction`, `OpportunityScenario.buyReferenceId`, `OpportunityScenario.sellReferenceId`, `OpportunityScenario.status`, `OpportunityScenario.liquidityCategory`, `OpportunityScenario.costBasisBrl`, `OpportunityScenario.netProceedsBrl`, `OpportunityScenario.netResultBrl`, `OpportunityScenario.marginPercent`, `OpportunityScenario.proceedsKind` e `OpportunityScenario.dataReferenceTime` (depende de T004–T007).

**Checkpoint**: Projeto, testes e tipos canônicos estão disponíveis; ainda não há telas ou regras específicas das histórias.

---

## Phase 3: User Story 1 - Consultar cenários simulados (Priority: P1) 🎯 MVP

**Goal**: Apresentar comparações válidas, sua origem simulada, validade, resultado e categoria de liquidez, sem ocultar cenários não lucrativos.

**Independent Test**: Carregar fixtures locais e verificar que a lista apresenta comparações positivas, nulas e negativas, mostra dados simulados e marcas temporais, e exclui como oportunidade disponível referências desatualizadas ou itens não equivalentes.

### Tests for User Story 1

- [X] T009 [P] [US1] Escrever testes de equivalência e validade temporal, incluindo floats numericamente iguais com zeros finais diferentes, floats divergentes, stickers em ordens diferentes ou com slot divergente, atributos opcionais e limite de 24 horas, em `frontend/src/app/features/opportunities/domain/opportunity-builder.spec.ts`.
- [X] T010 [P] [US1] Escrever testes da lista para resultados positivos, nulos, negativos, desatualizados, incompletos e vazios em `frontend/src/app/features/opportunities/pages/opportunity-list.page.spec.ts`.

### Implementation for User Story 1

- [X] T011 [US1] Criar fixtures estáticas com skins equivalentes e divergentes, preços nos dois marketplaces, moedas, custos, cotações, horários, sinais de liquidez e categorias baixa/média/alta, incluindo uma comparação com margem mínima de 3% e liquidez média/alta para SC-005, em `frontend/src/app/features/opportunities/data/opportunity.fixtures.ts`.
- [X] T012 [P] [US1] Implementar funções puras para equivalência de itens usando as regras de `data-model.md` para `SkinIdentity.floatValue`, `SkinIdentity.stickers`, `SkinIdentity.specialAttributes`, `Sticker.name` e `Sticker.slot`, validade de referências, estado do cenário e composição das oportunidades nos dois sentidos em `frontend/src/app/features/opportunities/domain/opportunity-builder.ts` (depende de T011).
- [X] T013 [P] [US1] Implementar acesso local tipado às fixtures e ao horário de referência fixo do conjunto em `frontend/src/app/features/opportunities/data/opportunity-mock.repository.ts` (depende de T011).
- [X] T014 [US1] Implementar página e componente da lista com origem/horário simulados, resultados não lucrativos, categoria de liquidez, dados incompletos, stale e estado vazio em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts` e `frontend/src/app/features/opportunities/ui/opportunity-list/opportunity-list.component.ts` (depende de T009–T013).

**Checkpoint**: US1 funciona isoladamente com fixtures locais, sem requisições de rede ou ações financeiras.

---

## Phase 4: User Story 2 - Comparar os dois sentidos da operação (Priority: P2)

**Goal**: Explicar preços, taxas, conversão, resultado e natureza do saldo recebido em cada sentido.

**Independent Test**: Abrir uma comparação válida de cada sentido e conferir os componentes dos cálculos; confirmar que venda na Steam é apresentada como crédito não sacável e não como dinheiro.

### Tests for User Story 2

- [X] T015 [P] [US2] Escrever testes de cálculo para alocação de taxas por etapa, conversão individual para BRL, resultado, margem, ausência de arredondamento intermediário, arredondamento half-up a duas casas, dados inválidos/ausentes e custo zero em `frontend/src/app/features/opportunities/domain/opportunity-calculator.spec.ts`.
- [X] T016 [P] [US2] Escrever testes da apresentação detalhada para os dois sentidos, saldo Steam não sacável, resultado não lucrativo e sentido indisponível em `frontend/src/app/features/opportunities/pages/opportunity-detail.page.spec.ts`.

### Implementation for User Story 2

- [X] T017 [US2] Implementar cálculo puro de custo total, valor líquido, resultado e margem usando Decimal.js e `data-model.md`: aplicar `FeeCost.appliesTo` e `FeeCost.kind`, calcular `OpportunityScenario.costBasisBrl`, `OpportunityScenario.netProceedsBrl`, `OpportunityScenario.netResultBrl` e `OpportunityScenario.marginPercent`, sem arredondar etapas intermediárias, em `frontend/src/app/features/opportunities/domain/opportunity-calculator.ts` (depende de T015).
- [X] T018 [US2] Implementar comparação detalhada com valores originais, taxas/custos, cotação, valores em BRL e rótulo de tipo de saldo em `frontend/src/app/features/opportunities/pages/opportunity-detail.page.ts` e `frontend/src/app/features/opportunities/ui/opportunity-comparison/opportunity-comparison.component.ts` (depende de T012–T013 e T016–T017).

**Checkpoint**: US2 pode ser validada com fixtures conhecidas e mantém distintos dinheiro disponível e saldo Steam.

---

## Phase 5: User Story 3 - Encontrar cenários por filtros (Priority: P3)

**Goal**: Combinar filtros e ordenar resultados sem misturar naturezas de saldo entre sentidos.

**Independent Test**: Aplicar filtros conhecidos às fixtures, conferir interseção dos critérios, limites inclusivos, categorias mínimas de liquidez, ordenação e limpeza dos filtros.

### Tests for User Story 3

- [X] T019 [P] [US3] Escrever testes para busca sem distinção de caixa, limites inclusivos, filtros AND, faixa inválida, categoria mínima e ordenação por sentido em `frontend/src/app/features/opportunities/domain/opportunity-filters.spec.ts`.
- [X] T020 [P] [US3] Escrever testes dos controles de filtro, combinação, estado sem resultados e ação de limpar em `frontend/src/app/features/opportunities/ui/opportunity-filter-bar/opportunity-filter-bar.spec.ts`.

### Implementation for User Story 3

- [X] T021 [US3] Implementar funções puras de filtragem e ordenação por resultado, margem e categoria de liquidez em `frontend/src/app/features/opportunities/domain/opportunity-filters.ts` (depende de T019; categorias seguem baixa < média < alta).
- [X] T022 [US3] Implementar controles de filtros e integração com a lista, incluindo validação da faixa de custo e estado sem resultados em `frontend/src/app/features/opportunities/ui/opportunity-filter-bar/opportunity-filter-bar.component.ts` e `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts` (depende de T020–T021 e T014).

**Checkpoint**: US3 pode ser demonstrada com qualquer combinação válida e não altera as regras de cálculo ou equivalência.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validar os fluxos completos e atender aos requisitos transversais da constituição.

- [X] T023 [P] Criar cenário Playwright para lista → filtros → comparação, incluindo dados simulados, resultados não lucrativos, saldo Steam e ausência de ações financeiras em `frontend/e2e/opportunity-discovery.spec.ts` (depende de T014, T018 e T022).
- [X] T024 [P] Refinar acessibilidade e layout responsivo em `frontend/src/app/features/opportunities/pages/opportunity-list.page.scss`, `frontend/src/app/features/opportunities/pages/opportunity-detail.page.scss`, `frontend/src/app/features/opportunities/ui/opportunity-filter-bar/opportunity-filter-bar.component.html` e `frontend/src/app/features/opportunities/ui/opportunity-filter-bar/opportunity-filter-bar.component.scss`, cobrindo teclado, foco, rótulos, contraste e viewports móvel/tablet/desktop.
- [X] T025 Implementar medição Playwright da atualização de filtros/ordenação para até 200 cenários e validar p95 de até 200 ms em 30 execuções, sem rede, em `frontend/e2e/opportunity-performance.spec.ts` (depende de T014, T022 e T024).
- [X] T026 Atualizar e executar os comandos e cenários de aceitação em `specs/001-opportunity-discovery/quickstart.md`, registrando apenas instruções que funcionem com os scripts efetivamente configurados em `frontend/package.json` (depende de T023–T025).
- [ ] T027 Conduzir avaliação sem orientação com cinco participantes para a tarefa de filtros e registrar somente quantidade de sucessos e tempos, sem dados pessoais, em `specs/001-opportunity-discovery/quickstart.md`; o critério é pelo menos quatro conclusões em até dois minutos (depende de T026).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; deve ser concluído primeiro.
- **Foundational (Phase 2)**: Depende do projeto e das dependências; bloqueia todas as histórias.
- **US1 (Phase 3)**: Depende da fundação; entrega o MVP mínimo da lista simulada.
- **US2 (Phase 4)**: Depende dos tipos e cenários comuns; integra-se à lista de US1 para abrir detalhes.
- **US3 (Phase 5)**: Depende dos dados e lista de US1; não depende do comparador detalhado de US2.
- **Polish (Phase 6)**: Depende das histórias desejadas; valida navegação, acessibilidade, performance local, usabilidade e instruções finais.

### User Story Dependencies

- **US1 (P1)**: Independente após a Phase 2; primeiro incremento demonstrável.
- **US2 (P2)**: Usa os modelos e cenários comuns; sua tela detalhada é acessada a partir da lista de US1.
- **US3 (P3)**: Usa a coleção e a lista de US1; pode ser desenvolvida sem concluir US2.

### Parallel Opportunities

- **Phase 2**: Após T004, T005–T007 podem ser implementadas em arquivos separados; T008 começa após a conclusão de T005–T007.
- **US1**: T009 e T010 podem ser escritos em paralelo; depois de T011, T012 e T013 podem avançar em paralelo.
- **US2**: T015 e T016 podem ser escritos em paralelo; implementação do cálculo e da página aguarda os testes correspondentes.
- **US3**: T019 e T020 podem ser escritos em paralelo; implementação do filtro puro e da barra aguarda seus testes.
- **Polish**: T023 e T024 atuam em arquivos distintos depois das histórias; T025 mede performance após a implementação e refinamento da lista.

## Parallel Example: User Story 1

```text
# Após concluir os tipos da Phase 2:
T009: testes de equivalência/validade em opportunity-builder.spec.ts
T010: testes de estados da lista em opportunity-list.page.spec.ts

# Após criar as fixtures em T011:
T012: derivação de cenários em opportunity-builder.ts
T013: acesso às fixtures em opportunity-mock.repository.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Setup e Foundational.
2. Implementar e validar US1 com fixtures locais e testes automatizados.
3. Demonstrar a lista com indicadores simulados, resultados não lucrativos e tratamento de dados incompletos/desatualizados.
4. Parar para revisão antes de iniciar comparação detalhada ou filtros avançados.

### Incremental Delivery

1. Setup + Foundational → base Angular e modelos compartilhados.
2. US1 → lista de cenários simulados (MVP inicial).
3. US2 → comparação financeira detalhada em ambos os sentidos.
4. US3 → filtros combináveis e ordenação.
5. Polish → fluxo E2E, acessibilidade, responsividade, meta de performance local e avaliação de usabilidade revisados.

## Notes

- Toda tarefa segue o formato `- [ ] T### [P?] [Story?] descrição com caminho de arquivo`.
- `[P]` indica tarefas em arquivos distintos sem dependência pendente; tarefas com conflito em `package.json` são sequenciais.
- Tarefas de teste precedem a implementação de cada história, conforme a constituição.
- Os tipos e restrições dos campos têm como fonte canônica `data-model.md`; as tarefas de modelo citam cada campo implementado.
- Não há tarefas de API, backend, banco de dados, autenticação ou integração com marketplaces.
