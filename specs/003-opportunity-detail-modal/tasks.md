---

description: "Task list for opportunity detail dialog"
---

# Tasks: Modal de Detalhes das Oportunidades

**Input**: Design documents from `specs/003-opportunity-detail-modal/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Incluídos porque a constituição exige validação automatizada de estados, foco, teclado e responsividade.

**Organization**: Tarefas organizadas por história do usuário para permitir implementação e validação incremental.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar o componente de diálogo sem alterar os cálculos ou filtros existentes.

- [X] T001 Verificar suporte a Angular CDK Dialog e módulos Angular Material necessários em `frontend/package.json` e `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts`.
- [X] T002 Criar a estrutura do componente de diálogo em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.ts` e `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.scss`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir o contexto compartilhado e integrar o serviço de diálogo à tabela.

**CRITICAL**: Nenhuma história pode começar antes desta fase.

- [X] T003 Definir o contrato local conforme `data-model.md`: `DialogContext.scenario`, `DialogContext.buy`, `DialogContext.sell` e `DialogContext.skinName` em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.ts`.
- [X] T004 Resolver compra e venda da oportunidade selecionada sem recalcular `OpportunityScenario` em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.
- [X] T005 Conectar o evento `detail` da tabela à página, abrir `MatDialog` somente para cenário válido e restaurar foco no acionador em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts` e `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts`.

**Checkpoint**: Contexto da modal e integração base disponíveis para todas as histórias.

---

## Phase 3: User Story 1 - Abrir detalhes sem sair da tabela (Priority: P1) MVP

**Goal**: Substituir o texto `Detalhes` por um ícone acessível que abre a comparação sobre a lista.

**Independent Test**: Aplicar um filtro, clicar no ícone de uma linha válida e confirmar modal, URL preservada e contexto da tabela intacto.

### Tests for User Story 1

- [X] T006 [P] [US1] Escrever teste unitário que verifica `DetailAction.opportunity`, `DetailAction.skinName`, `DetailAction.ariaLabel` e `DetailAction.icon` em cenários válidos e rejeita ação inválida em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.spec.ts`.
- [X] T007 [P] [US1] Escrever teste Playwright de abertura sem alteração da rota e de preservação dos valores de pesquisa, direção, ordenação e tema após fechar em `frontend/e2e/opportunity-detail-dialog.spec.ts`.

### Implementation for User Story 1

- [X] T008 [US1] Substituir o link textual por botão com ícone `visibility` e sem texto visível `Detalhes`, conforme `data-model.md` `DetailAction.opportunity`, `DetailAction.skinName`, `DetailAction.ariaLabel` e `DetailAction.icon`, em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts`.
- [X] T009 [US1] Abrir `OpportunityDetailDialogComponent` na página com `data-model.md` `DialogContext.scenario`, `DialogContext.buy`, `DialogContext.sell` e `DialogContext.skinName`, após receber a linha emitida pela tabela, em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.
- [X] T010 [US1] Criar o diálogo com título da skin e reutilização de `OpportunityComparisonComponent`, sem recalcular valores, em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.ts`.
- [X] T011 [US1] Manter os sinais de filtro, ordenação e tema sem reset durante a abertura e fechamento do diálogo em `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.

**Checkpoint**: US1 entrega a abertura da comparação por ícone sem trocar de rota.

---

## Phase 4: User Story 2 - Aplicar modal aos dois sentidos de comparação (Priority: P1)

**Goal**: Preservar os sentidos Steam → CSFloat e CSFloat → Steam, incluindo crédito Steam não sacável.

**Independent Test**: Abrir linhas válidas dos dois sentidos e conferir direção, valores simulados e natureza do crédito.

### Tests for User Story 2

- [X] T012 [P] [US2] Escrever testes unitários dos dois sentidos e estado válido em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.spec.ts`.
- [X] T013 [P] [US2] Escrever teste Playwright de Steam → CSFloat e CSFloat → Steam em `frontend/e2e/opportunity-detail-dialog.spec.ts`.

### Implementation for User Story 2

- [X] T014 [US2] Encaminhar `data-model.md` `DialogContext.scenario` sem transformação ao componente de comparação, preservando direção e natureza do valor recebido do cenário de domínio, em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.ts`.
- [X] T015 [US2] Garantir que `data-model.md` `DetailAction.opportunity` só permita detalhe quando o cenário associado estiver válido em `frontend/src/app/features/opportunities/ui/opportunity-table/opportunity-table.component.ts`.
- [X] T016 [US2] Manter dados simulados e crédito Steam não sacável sem apresentação como dinheiro disponível em `frontend/src/app/features/opportunities/ui/opportunity-comparison/opportunity-comparison.component.ts` e `.scss`.

**Checkpoint**: US2 mantém os sentidos separados e invalida ações para estados não válidos.

---

## Phase 5: User Story 3 - Fechar e navegar pela modal com segurança (Priority: P2)

**Goal**: Disponibilizar fechamento previsível, foco acessível e apresentação responsiva da modal.

**Independent Test**: Abrir e fechar por botão, Escape e backdrop em teclado, desktop e celular, confirmando retorno do foco.

### Tests for User Story 3

- [X] T017 [P] [US3] Escrever teste unitário de fechamento e rótulo acessível do controle de fechar em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.spec.ts`.
- [X] T018 [P] [US3] Escrever teste Playwright do fluxo de teclado: abrir com Enter, navegar com Tab, fechar com Escape e recuperar foco em `frontend/e2e/opportunity-detail-dialog.spec.ts`.

### Implementation for User Story 3

- [X] T019 [US3] Implementar controle de fechar, suporte a Escape e fechamento obrigatório por clique no backdrop em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.ts` e `frontend/src/app/features/opportunities/pages/opportunity-list.page.ts`.
- [X] T020 [US3] Aplicar largura responsiva, altura máxima, rolagem interna e posicionamento do botão de fechar; manter a caixa da modal dentro da viewport em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.scss`.
- [X] T021 [US3] Aplicar tokens claro/escuro à superfície da modal e camada escura semitransparente no backdrop conforme `FR-015` em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.scss` e `frontend/src/styles.scss`.
- [X] T022 [US3] Respeitar movimento reduzido e não depender de animação para abrir ou fechar em `frontend/src/app/features/opportunities/ui/opportunity-detail-dialog/opportunity-detail-dialog.component.scss`.

**Checkpoint**: US3 preserva acessibilidade, tema e operação em telas estreitas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validar integração completa, documentação e regressão visual.

- [X] T023 [P] Validar ação por ícone, fluxo de teclado, opacidade mínima do backdrop, temas e limites da modal em 320 px, 768 px e 1440 px em `frontend/e2e/opportunity-detail-dialog.spec.ts`.
- [X] T024 [P] Executar suite Vitest e corrigir somente regressões relacionadas à modal em `frontend/src/app/features/opportunities/`.
- [X] T025 Executar build Angular e Playwright da feature em `frontend/package.json` e `frontend/e2e/opportunity-detail-dialog.spec.ts`.
- [X] T026 Atualizar `specs/003-opportunity-detail-modal/quickstart.md` com os comandos e cenários validados em `frontend/package.json`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; pode começar imediatamente.
- **Foundational (Phase 2)**: Depende da Phase 1 e bloqueia todas as histórias.
- **US1 (Phase 3)**: Depende da fundação e entrega o MVP da modal.
- **US2 (Phase 4)**: Depende da fundação e reutiliza o diálogo de US1.
- **US3 (Phase 5)**: Depende da fundação e integra-se ao diálogo de US1.
- **Polish (Phase 6)**: Depende das histórias desejadas.

### User Story Dependencies

- **User Story 1 (P1)**: Independente após a fundação; pode ser entregue como MVP.
- **User Story 2 (P1)**: Depende do diálogo criado em US1.
- **User Story 3 (P2)**: Depende do diálogo criado em US1.

### Parallel Opportunities

- T006 e T007 podem ser escritos em paralelo após a fundação.
- T012 e T013 podem ser escritos em paralelo.
- T017 e T018 podem ser escritos em paralelo.
- T023 e T024 podem avançar em paralelo na fase de polish.

### Parallel Example: User Story 1

```text
T006: teste unitário da ação por ícone
T007: teste Playwright da abertura sem mudança de rota
T008: substituição do texto por ícone
T009: abertura com contexto da modal
T010: renderização da comparação no diálogo
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Concluir Setup e Foundational.
2. Implementar US1: ação por ícone e modal sobre a tabela.
3. Validar rota, filtros e tema preservados.
4. Adicionar US2 para os dois sentidos e estados inválidos.
5. Concluir US3 com foco, Escape, backdrop e responsividade.
6. Executar Polish e regressão completa.

## Notes

- `[P]` indica tarefas em arquivos separados sem dependência pendente.
- Nenhuma tarefa adiciona backend, API, persistência externa ou operação financeira.
- Os campos citados seguem `data-model.md` e não devem ser duplicados em tipos visuais.
