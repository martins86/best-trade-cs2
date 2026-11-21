---

description: "Task list for Angular Material layout refactor"
---

# Tasks: Refactor do Layout Angular

**Input**: Design documents from `specs/002-angular-layout-refactor/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Incluídos porque a constituição exige validação automatizada de estados, tema, navegação e responsividade.

**Organization**: Tarefas organizadas por história do usuário para permitir implementação e validação incremental.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar os pontos compartilhados do refactor sem alterar o domínio financeiro.

- [X] T001 Verificar integração Angular Material/CDK 22 no projeto em `frontend/package.json` e `frontend/angular.json`.
- [X] T002 Criar estrutura compartilhada em `frontend/src/app/core/theme/`, `frontend/src/app/shared/layout/` e `frontend/src/app/shared/ui`.
- [X] T003 [P] Definir tokens visuais globais para temas claro/escuro, superfícies, bordas e estados em `frontend/src/styles.scss`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Criar os serviços e abstrações que todas as histórias visualizarão.

**CRITICAL**: Nenhuma história de usuário pode começar antes desta fase.

- [X] T004 Definir o modelo de shell e destinos conforme `data-model.md`: `ApplicationShell.activeDestination`, `ApplicationShell.compactDesktop`, `ApplicationShell.mobileMenuOpen` e `NavigationDestination.available` em `frontend/src/app/shared/layout/layout.types.ts`.
- [X] T005 Implementar serviço de tema com `ThemePreference.theme`, fallback escuro e persistência local conforme `data-model.md` em `frontend/src/app/core/theme/theme.service.ts`.
- [X] T006 Implementar estado responsivo compartilhado para breakpoints desktop, tablet e celular em `frontend/src/app/shared/layout/layout-state.service.ts`.
- [X] T007 Criar componentes base de shell com toolbar, sidebar e menu móvel em `frontend/src/app/shared/layout/app-shell.component.ts` e `frontend/src/app/shared/layout/app-shell.component.scss`.
- [X] T008 Integrar o shell às rotas existentes sem alterar `/opportunities` e `/opportunities/:skinId` em `frontend/src/app/app.ts` e `frontend/src/app/app.routes.ts`.

**Checkpoint**: Shell, tema e breakpoints estão disponíveis para todas as histórias.

---

## Phase 3: User Story 1 - Navegar em uma estrutura operacional consistente (Priority: P1) MVP

**Goal**: Disponibilizar sidebar, toolbar, breadcrumb e navegação responsiva em desktop, tablet e celular.

**Independent Test**: Abrir a aplicação em 1440 px, 768 px e 320 px, navegar entre lista e detalhe e confirmar que somente destinos implementados são acionáveis.

### Tests for User Story 1

- [X] T009 [P] [US1] Escrever testes de shell, destinos disponíveis/futuros e estado do menu em `frontend/src/app/shared/layout/app-shell.component.spec.ts`.
- [X] T010 [P] [US1] Escrever testes Playwright para sidebar desktop, navegação tablet e menu celular em `frontend/e2e/layout-navigation.spec.ts`.

### Implementation for User Story 1

- [X] T011 [US1] Implementar `data-model.md` `NavigationDestination.id`, `NavigationDestination.label`, `NavigationDestination.route`, `NavigationDestination.available` e `NavigationDestination.icon`, além da indicação de áreas futuras em `frontend/src/app/shared/layout/app-shell.component.ts`.
- [X] T012 [US1] Aplicar sidebar fixa acima de 1200 px, sidebar compacta entre 601 px e 1200 px e menu móvel até 600 px em `frontend/src/app/shared/layout/app-shell.component.scss`.
- [X] T013 [US1] Implementar toolbar, breadcrumb e área de ações usando Angular Material em `frontend/src/app/shared/layout/app-shell.component.ts` e `frontend/src/app/shared/layout/app-shell.component.scss`.
- [X] T014 [US1] Integrar navegação ativa, foco do menu e fechamento após seleção em `frontend/src/app/shared/layout/app-shell.component.ts`.

**Checkpoint**: US1 entrega navegação consistente e responsiva independentemente das demais histórias.

---

## Phase 4: User Story 2 - Alternar tema claro e escuro (Priority: P1)

**Goal**: Aplicar tema claro/escuro persistente a todo o shell e às superfícies da aplicação.

**Independent Test**: Alternar tema, navegar para detalhe e recarregar, confirmando persistência e contraste em todas as superfícies.

### Tests for User Story 2

- [X] T015 [P] [US2] Escrever testes do serviço de tema para fallback, preferência válida e persistência em `frontend/src/app/core/theme/theme.service.spec.ts`.
- [X] T016 [P] [US2] Escrever teste Playwright de alternância, rótulo acessível e persistência em `frontend/e2e/theme.spec.ts`.

### Implementation for User Story 2

- [X] T017 [US2] Implementar botão de tema Material, rótulo acessível e atualização reativa conforme `data-model.md` `ThemePreference.theme` em `frontend/src/app/shared/layout/app-shell.component.ts`.
- [X] T018 [US2] Aplicar tokens de tema a shell, toolbar, cards, tabela, inputs e estados em `frontend/src/styles.scss` e `frontend/src/app/shared/layout/app-shell.component.scss`.
- [X] T019 [US2] Respeitar preferência salva ou usar tema escuro quando `ThemePreference.theme` estiver ausente ou inválido em `frontend/src/app/core/theme/theme.service.ts`.

**Checkpoint**: US1 e US2 funcionam juntas em todas as larguras e temas.

---

## Phase 5: User Story 3 - Consultar panorama operacional de oportunidades (Priority: P1)

**Goal**: Transformar a página principal em painel escaneável com indicadores derivados e tabela responsiva de cenários.

**Independent Test**: Abrir fixtures locais em desktop e confirmar indicadores reais derivados, tabela completa, estados válidos/negativos e navegação ao detalhe.

### Tests for User Story 3

- [X] T020 [P] [US3] Escrever testes dos indicadores derivados sem duplicar dados financeiros em `frontend/src/app/features/opportunities/pages/opportunity-list.page.spec.ts`.
- [X] T021 [P] [US3] Escrever testes da apresentação de linhas positivas, negativas, incompletas e desatualizadas em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.spec.ts`.

### Implementation for User Story 3

- [X] T022 [US3] Adaptar `data-model.md` `OpportunityRow.skinIdentityId`, `OpportunityRow.skinName`, `OpportunityRow.direction`, `OpportunityRow.status`, `OpportunityRow.proceedsKind`, `OpportunityRow.liquidityCategory`, `OpportunityRow.costBasisBrl`, `OpportunityRow.netProceedsBrl`, `OpportunityRow.netResultBrl` e `OpportunityRow.marginPercent` em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts`, sem recalcular cenários.
- [X] T023 [US3] Implementar tabela Angular Material com rolagem horizontal, colunas Skin/Direção/Compra/Venda/Resultado/Margem/Liquidez e link ao detalhe em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts` e `.scss`.
- [X] T024 [US3] Implementar `data-model.md` `DashboardIndicator.id`, `DashboardIndicator.label`, `DashboardIndicator.value` e `DashboardIndicator.detail` em `frontend/src/app/features/opportunities/ui/opportunity-indicators/opportunity-indicators.component.ts`.
- [X] T025 [US3] Refatorar `opportunity-list.page.ts` para combinar shell, indicadores, filtros e tabela sem alterar o domínio existente em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.
- [X] T026 [US3] Aplicar estados vazios, incompletos, desatualizados e não lucrativos com texto e não apenas cor em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.scss`.

**Checkpoint**: US3 apresenta o panorama funcional com dados simulados e estados legíveis.

---

## Phase 6: User Story 4 - Usar filtros em barra compacta (Priority: P2)

**Goal**: Integrar pesquisa e filtros ao novo shell sem alterar a lógica existente de filtragem.

**Independent Test**: Aplicar pesquisa, margem, liquidez, direção e faixa de custo, confirmar interseção AND, faixa inválida e limpeza.

### Tests for User Story 4

- [X] T027 [P] [US4] Escrever testes dos controles Material para `data-model.md` `FilterState.search`, `FilterState.marginMin`, `FilterState.liquidityMin` e `FilterState.direction` em `frontend/src/app/features/opportunities/pages/opportunity-list.page.spec.ts`.
- [X] T028 [P] [US4] Escrever testes de faixa inválida, estado vazio e limpar filtros em `frontend/src/app/features/opportunities/pages/opportunity-list.page.spec.ts`.

### Implementation for User Story 4

- [X] T029 [US4] Implementar barra compacta com campos Angular Material para `data-model.md` `FilterState.search`, `FilterState.direction`, `FilterState.liquidityMin` e `FilterState.marginMin` em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.
- [X] T030 [US4] Adicionar campos de custo mínimo/máximo e validação de `data-model.md` `FilterState.costMin > FilterState.costMax` em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.
- [X] T031 [US4] Conectar filtros e limpeza à tabela existente e ao estado vazio em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts` e `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts`.
- [X] T032 [US4] Estilizar controles, erros de faixa e estado vazio com Angular Material em `frontend/src/app/features/opportunities/pages/opportunity-list.page.scss` e `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.scss`.

**Checkpoint**: US4 aplica filtros combinados sem alterar cálculos ou equivalência.

---

## Phase 7: User Story 5 - Abrir comparações sem abandonar o shell (Priority: P2)

**Goal**: Aplicar o mesmo shell, tema e hierarquia visual à página de comparação existente.

**Independent Test**: Navegar da tabela para os dois sentidos da comparação e voltar pelo link disponível sem perder tema ou contexto.

### Tests for User Story 5

- [X] T033 [P] [US5] Escrever testes da comparação detalhada dentro do shell, incluindo crédito Steam não sacável em `frontend/src/app/features/opportunities/pages/opportunity-detail.page.spec.ts`.
- [X] T034 [P] [US5] Escrever teste Playwright da tabela → detalhe → volta em `frontend/e2e/opportunity-layout.spec.ts`.

### Implementation for User Story 5

- [X] T035 [US5] Refatorar a página de detalhe para usar toolbar, breadcrumb, cards e superfícies do shell em `frontend/src/app/features/opportunities/pages/opportunity-detail.page.ts` e `.scss`.
- [X] T036 [US5] Atualizar o componente de comparação com Angular Material, mantendo `OpportunityScenario` e sem recalcular valores em `frontend/src/app/features/opportunities/ui/opportunity-comparison/opportunity-comparison.component.ts` e `.scss`.
- [X] T037 [US5] Garantir que os sentidos Steam → CSFloat e CSFloat → Steam permaneçam separados e que crédito Steam não seja descrito como dinheiro em `frontend/src/app/features/opportunities/pages/opportunity-detail.page.ts`.

**Checkpoint**: US5 preserva o fluxo completo e mantém o contexto visual entre lista e detalhe.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validar acessibilidade, responsividade, performance e documentação do refactor.

- [X] T038 [P] Adicionar teste Playwright de rolagem da tabela e operação por teclado em 320 px, 768 px e 1440 px em `frontend/e2e/layout-navigation.spec.ts`.
- [X] T039 [P] Validar contraste, foco, rótulos e estados em tema claro/escuro em `frontend/e2e/theme.spec.ts` e `frontend/src/styles.scss`.
- [X] T040 Implementar medição de atualização da tabela em até 200 cenários e 30 execuções em `frontend/e2e/opportunity-layout-performance.spec.ts`.
- [X] T041 Atualizar `specs/002-angular-layout-refactor/quickstart.md` com comandos testados em `frontend/package.json` e cenários visuais reais.
- [X] T042 Executar build, Vitest e Playwright e corrigir somente falhas relacionadas ao refactor em `frontend/package.json` e arquivos afetados.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; pode começar imediatamente.
- **Foundational (Phase 2)**: Depende da Phase 1 e bloqueia todas as histórias.
- **US1 (Phase 3)**: Depende da fundação e entrega o MVP visual.
- **US2 (Phase 4)**: Depende da fundação; integra-se ao shell de US1.
- **US3 (Phase 5)**: Depende da fundação e pode integrar-se ao shell após US1.
- **US4 (Phase 6)**: Depende de US3 e da fundação.
- **US5 (Phase 7)**: Depende de US1 e US3; reutiliza o shell e a tabela.
- **Polish (Phase 8)**: Depende das histórias desejadas.

### User Story Dependencies

- **US1 (P1)**: Independente após a fundação; MVP visual de navegação.
- **US2 (P1)**: Independente após o shell; pode ser integrada em paralelo com US1.
- **US3 (P1)**: Depende da fundação e do shell; entrega a tabela principal.
- **US4 (P2)**: Depende da tabela de US3.
- **US5 (P2)**: Depende do shell de US1 e dos cenários de US3.

### Parallel Opportunities

- T003 pode ocorrer em paralelo com a preparação da estrutura T002.
- T009 e T010 podem ser escritos em paralelo após T007.
- T015 e T016 podem ser escritos em paralelo após T005.
- T020 e T021 podem ser escritos em paralelo após a criação da tabela planejada.
- T027 e T028 podem ser escritos em paralelo antes da implementação dos filtros.
- T033 e T034 podem ser escritos em paralelo antes do refactor do detalhe.
- T038 e T039 podem avançar em paralelo na fase de polish.

### Parallel Example: User Story 1

```text
T009: testes de shell em app-shell.component.spec.ts
T010: testes Playwright de navegação responsiva
T011: destinos e estados futuros
T012: breakpoints do shell
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Concluir Setup e Foundational.
2. Implementar US1: navegação responsiva.
3. Implementar US2: tema claro/escuro.
4. Implementar US3: indicadores e tabela de oportunidades.
5. Validar o MVP visual antes dos filtros ampliados e do detalhe refinado.

### Incremental Delivery

1. Setup + Foundational → shell e tema prontos.
2. US1 → navegação independente e responsiva.
3. US2 → temas persistentes.
4. US3 → panorama principal com dados simulados.
5. US4 → barra de filtros completa.
6. US5 → detalhe integrado ao shell.
7. Polish → acessibilidade, performance e documentação.

## Correções visualizadas pendentes

- [X] T043 Corrigir o carregamento e a renderização dos ícones Angular Material na sidebar e toolbar em `frontend/src/app/shared/layout/app-shell.component.ts`, `frontend/src/app/shared/layout/app-shell.component.scss` e `frontend/src/styles.scss`; manter rótulo textual acessível em cada destino.
- [X] T044 Corrigir a cor de fonte do tema escuro em tabelas, filtros, indicadores e estados em `frontend/src/app/features/opportunities/pages/opportunity-list.page.scss`, `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.scss` e `frontend/src/styles.scss`.
- [X] T045 Preservar o tema escuro na página de detalhe e substituir estilos claros fixos por tokens do tema em `frontend/src/app/features/opportunities/pages/opportunity-detail.page.scss` e `frontend/src/app/features/opportunities/ui/opportunity-comparison/opportunity-comparison.component.scss`.
- [X] T046 Ajustar alinhamento, tamanho dos ícones e espaçamento vertical exato de 6 px dos itens da navegação lateral conforme `FR-021` em `frontend/src/app/shared/layout/app-shell.component.scss`.
- [X] T047 Remover a nota de template e o comentário `ACTION REQUIRED` remanescentes em `specs/002-angular-layout-refactor/plan.md`.
---

## Notes

- `[P]` indica tarefas em arquivos separados sem dependência pendente.
- Tarefas de cada história têm rótulo `[US1]` a `[US5]`.
- Os campos citados seguem `data-model.md` e não devem ser duplicados em tipos visuais.
- Nenhuma tarefa adiciona backend, API, persistência externa ou ações financeiras.
