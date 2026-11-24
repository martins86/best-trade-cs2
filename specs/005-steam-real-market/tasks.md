# Tasks: Dados reais da Steam no front-end

**Input**: Design documents from `/specs/005-steam-real-market/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Incluídos porque a especificação exige estados de dados reais, falha, cache e navegação paginada verificáveis.

**Organization**: Tarefas agrupadas por história de usuário para permitir implementação e validação incremental.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar a feature separada para dados reais da Steam.

- [ ] T001 Criar a estrutura da feature Steam em `frontend/src/app/features/steam-market/data/`, `frontend/src/app/features/steam-market/domain/`, `frontend/src/app/features/steam-market/pages/` e `frontend/src/app/features/steam-market/ui/`.
- [ ] T002 Registrar o gateway Steam aprovado, timeout e limite de cache em `frontend/src/app/features/steam-market/data/steam-market.config.ts`, conforme FR-017 e FR-018.
- [ ] T003 Criar e registrar a rota da página Steam em `frontend/src/app/app.routes.ts` e no shell em `frontend/src/app/shared/layout/app-shell.component.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modelos e contratos compartilhados que bloqueiam todas as histórias.

**CRITICAL**: Nenhuma história pode iniciar até esta fase terminar.

- [ ] T004 Definir os tipos `SteamMarketItem`, `SteamMarketPage`, `SteamCacheEntry` e `SteamQueryResult` conforme `specs/005-steam-real-market/data-model.md` em `frontend/src/app/features/steam-market/domain/steam-market.models.ts`.
- [ ] T005 Implementar validação dos campos de `SteamMarketItem` conforme `data-model.md` em `frontend/src/app/features/steam-market/domain/steam-market-normalizer.ts`.
- [ ] T006 Implementar o contrato HTTP tipado da Steam conforme `specs/005-steam-real-market/contracts/steam-market-query.contract.md` em `frontend/src/app/features/steam-market/data/steam-market-api.models.ts`.
- [ ] T007 Implementar o adaptador HTTP da Steam em `frontend/src/app/features/steam-market/data/steam-market-api.service.ts`, sem fallback para fixtures.
- [ ] T008 Configurar estados compartilhados de carregamento, sucesso, vazio e erro em `frontend/src/app/features/steam-market/domain/steam-market-state.ts`.
- [ ] T009 Criar testes unitários dos modelos, normalização e classificação de erros em `frontend/src/app/features/steam-market/domain/steam-market-normalizer.spec.ts` e `frontend/src/app/features/steam-market/data/steam-market-api.service.spec.ts`.

**Checkpoint**: Fundação pronta; os adaptadores não dependem de UI e não misturam dados simulados.

---

## Phase 3: User Story 1 - Consultar itens reais mais comercializados da Steam (Priority: P1) 🎯 MVP

**Goal**: Exibir no máximo 20 itens reais da Steam por página, ordenados por popularidade e com menor preço.

**Independent Test**: Consultar a página real e confirmar até 20 itens válidos, origem Steam, menor preço, horário da coleta e navegação sem duplicação.

### Tests for User Story 1

- [ ] T010 [P] [US1] Escrever testes da normalização de `SteamMarketItem.marketHashName`, `SteamMarketItem.appId`, `SteamMarketItem.sellListings` e `SteamMarketItem.lowestPriceMinor` em `frontend/src/app/features/steam-market/domain/steam-market-normalizer.spec.ts`, conforme `data-model.md`.
- [ ] T011 [P] [US1] Escrever testes da paginação de 20 itens, remoção de duplicados e cálculo de `SteamMarketPage.offset`, `SteamMarketPage.items`, `SteamMarketPage.totalCount`, `SteamMarketPage.hasMore`, `SteamMarketPage.collectedAt` e `SteamMarketPage.status` em `frontend/src/app/features/steam-market/domain/steam-market-pagination.spec.ts`, conforme `data-model.md`.
- [ ] T012 [P] [US1] Escrever teste E2E da lista real, menor preço e metadados da Steam em `frontend/e2e/steam-real-market.spec.ts`.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implementar `SteamMarketItem` e `SteamMarketPage` conforme `SteamMarketItem.marketHashName`, `SteamMarketItem.name`, `SteamMarketItem.appId`, `SteamMarketItem.sellListings`, `SteamMarketItem.lowestPriceMinor`, `SteamMarketItem.currencyCode`, `SteamMarketItem.collectedAt`, `SteamMarketItem.source`, `SteamMarketPage.offset`, `SteamMarketPage.items`, `SteamMarketPage.totalCount`, `SteamMarketPage.collectedAt` e `SteamMarketPage.status` em `data-model.md`.
- [ ] T014 [US1] Implementar consulta paginada da Steam em páginas de 20 itens em `frontend/src/app/features/steam-market/data/steam-market-api.service.ts`.
- [ ] T015 [US1] Implementar orquestração da página, offset, próxima/anterior e invalidação de respostas antigas em `frontend/src/app/features/steam-market/pages/steam-market-list.page.ts`.
- [ ] T016 [P] [US1] Implementar a lista visual com origem, moeda, menor preço, volume comercial e horário em `frontend/src/app/features/steam-market/ui/steam-market-list.component.ts`.
- [ ] T017 [P] [US1] Implementar estados vazios, carregamento e fim da lista em `frontend/src/app/features/steam-market/ui/steam-market-list.component.ts` e `frontend/src/app/features/steam-market/pages/steam-market-list.page.scss`.

**Checkpoint**: US1 entrega a primeira página real da Steam independentemente das demais histórias.

---

## Phase 4: User Story 2 - Consultar dados com falhas ou indisponibilidade da Steam (Priority: P2)

**Goal**: Informar transporte, limite de requisições, resposta inválida e fim de resultados sem misturar fixtures.

**Independent Test**: Simular cada tipo de falha e confirmar estado de erro, nova tentativa e ausência de dados simulados.

### Tests for User Story 2

- [ ] T018 [P] [US2] Escrever testes unitários dos estados `transport-error`, `rate-limited`, `invalid-response` e `unknown` em `frontend/src/app/features/steam-market/domain/steam-market-error.spec.ts`.
- [ ] T019 [P] [US2] Escrever testes E2E de falha, retry e fim de página em `frontend/e2e/steam-real-market.spec.ts`.

### Implementation for User Story 2

- [ ] T020 [US2] Implementar classificação dos erros HTTP e transformações inválidas em `frontend/src/app/features/steam-market/domain/steam-market-error.ts`.
- [ ] T021 [US2] Integrar carregamento, retry e resposta obsoleta à página em `frontend/src/app/features/steam-market/pages/steam-market-list.page.ts`.
- [ ] T022 [P] [US2] Implementar mensagens de erro e ação de nova tentativa em `frontend/src/app/features/steam-market/ui/steam-market-state.component.ts`.
- [ ] T023 [US2] Impedir fallback para fixtures e sinalizar dados reais de forma inequívoca em `frontend/src/app/features/steam-market/pages/steam-market-list.page.ts`.

**Checkpoint**: US1 e US2 funcionam juntas sem apresentar dados simulados como reais.

---

## Phase 5: User Story 3 - Reduzir consultas repetidas com cache em memória (Priority: P3)

**Goal**: Reutilizar páginas válidas da sessão por até cinco minutos sem persistência.

**Independent Test**: Revisitar uma página em memória, atualizar manualmente e recarregar a aplicação para confirmar TTL e limpeza.

### Tests for User Story 3

- [ ] T024 [P] [US3] Escrever testes de hit, miss, expiração e limpeza de `SteamCacheEntry.offset`, `SteamCacheEntry.page` e `SteamCacheEntry.expiresAt` em `frontend/src/app/features/steam-market/data/steam-market-cache.service.spec.ts`, conforme `data-model.md`.
- [ ] T025 [P] [US3] Escrever teste E2E de revisão rápida da página e limpeza após reload em `frontend/e2e/steam-real-market.spec.ts`.

### Implementation for User Story 3

- [ ] T026 [US3] Implementar cache em memória com chave por `SteamCacheEntry.offset`, valor `SteamCacheEntry.page` e expiração `SteamCacheEntry.expiresAt` em `frontend/src/app/features/steam-market/data/steam-market-cache.service.ts`, conforme `data-model.md`.
- [ ] T027 [US3] Integrar cache ao adaptador e expor atualização manual em `frontend/src/app/features/steam-market/data/steam-market-api.service.ts` e `frontend/src/app/features/steam-market/pages/steam-market-list.page.ts`.
- [ ] T028 [US3] Garantir que o cache não sobreviva ao reload e que erros não sejam armazenados como sucesso em `frontend/src/app/features/steam-market/data/steam-market-cache.service.ts`.

**Checkpoint**: Todas as histórias estão independentes e usam somente dados reais da Steam.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Integrar navegação, acessibilidade, responsividade e validação final.

- [ ] T029 [P] Ajustar navegação e identidade visual Steam no shell em `frontend/src/app/shared/layout/app-shell.component.ts` e `frontend/src/app/shared/layout/app-shell.component.scss`.
- [ ] T030 [P] Garantir teclado, foco, rótulos, contraste e viewports móvel/tablet/desktop em `frontend/src/app/features/steam-market/pages/steam-market-list.page.scss` e `frontend/src/app/features/steam-market/ui/steam-market-list.component.scss`.
- [ ] T031 [P] Medir revisita em cache em até 200 ms no percentil 95 em `frontend/e2e/steam-real-market-performance.spec.ts`.
- [ ] T032 [P] Adicionar fixtures HTTP controladas de contrato para testes sem depender da Steam em `frontend/src/app/features/steam-market/data/steam-market-api.fixtures.ts`.
- [ ] T033 Validar os cenários de `specs/005-steam-real-market/quickstart.md` e atualizar o guia.
- [ ] T034 Executar build, testes unitários e testes E2E completos da feature; incluir validação explícita de que nenhuma ação de compra, venda, saque, conexão de conta ou registro financeiro está disponível, conforme FR-014, FR-016 e SC-008.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sem dependências.
- Foundational (Phase 2): depende de Setup e bloqueia todas as histórias.
- US1 (Phase 3): depende da fundação.
- US2 (Phase 4): depende da fundação e integra-se à US1.
- US3 (Phase 5): depende da fundação e da consulta US1.
- Polish (Phase 6): depende das três histórias.

### User Story Dependencies

- US1: não depende de US2 ou US3.
- US2: usa estados da US1, mas pode ser testada independentemente com respostas simuladas.
- US3: usa o adaptador de US1 e pode ser testada independentemente.

### Parallel Opportunities

- Phase 1: T002 e T003 podem avançar em paralelo após T001.
- Phase 2: T004–T006 podem ser implementados em paralelo; T007 depende de T006 e T008.
- US1: T010–T012 podem ser escritos em paralelo; T016–T017 podem avançar em paralelo após os modelos.
- US2: T018–T019 podem ser escritos em paralelo; T022 depende das tarefas de estado.
- US3: T024–T025 podem ser escritos em paralelo; T026–T028 seguem o modelo e o adaptador.

## Parallel Example: User Story 1

```text
T010: testes de campos SteamMarketItem
T011: testes de paginação e duplicados
T012: teste E2E da lista real
T016: componente visual
T017: estados de carregamento, vazio e fim
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Setup e Foundational.
2. Implementar US1 com a primeira página real da Steam.
3. Validar independência contra fixtures HTTP controladas.
4. Parar antes de US2 e US3 quando o MVP real mínimo estiver demonstrável.

### Incremental Delivery

1. Setup + fundação.
2. US1: listagem real paginada de 20.
3. US2: erros e indisponibilidade.
4. US3: cache em memória.
5. Polish: navegação, acessibilidade e validação completa.

## Notes

- Nenhuma tarefa cria backend, banco, autenticação Steam, CSFloat ou registro financeiro.
- Campos citados referem-se a `specs/005-steam-real-market/data-model.md`.
- O gateway de borda necessário para CORS pode ser definido no planejamento técnico, mas não cria banco ou persistência.
