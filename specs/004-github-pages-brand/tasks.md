# Tasks: Roteamento GitHub Pages e Marca

**Input**: Design documents from `/specs/004-github-pages-brand/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Testes inclusos porque os cenários de acesso direto e identidade da marca são requisitos explícitos da especificação.

**Organization**: Tarefas agrupadas por user story para permitir implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependência de tarefas incompletas)
- **[Story]**: User story relacionada (US1 ou US2)
- Cada tarefa inclui caminho de arquivo exato

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar verificações locais existentes para a feature

- [X] T001 Instalar as dependências do projeto com `npm ci --prefix frontend`
- [X] T002 Registrar o baseline da suite unitária em `frontend/package.json` executando `npm test --prefix frontend`
- [X] T003 Registrar o baseline da suite E2E em `frontend/package.json` executando `npm run e2e --prefix frontend`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Garantir o artefato estático compartilhado que todas as histórias dependem

**⚠️ CRITICAL**: Nenhuma user story pode ser concluída até o fallback publicado estar definido

- [X] T004 Confirmar o prefixo público `/best-trade-cs2/` no build descrito em `.github/workflows/ci-cd.yml`
- [X] T005 Definir a geração de `404.html` a partir de `frontend/dist/frontend/browser/index.html` em `.github/workflows/ci-cd.yml`
- [X] T006 Preservar o wildcard existente de redirecionamento para `/opportunities` em `frontend/src/app/app.routes.ts`

**Checkpoint**: Build publicado preparado para servir a SPA em URLs internas conhecidas

---

## Phase 3: User Story 1 - Abrir uma rota diretamente no GitHub Pages (Priority: P1) 🎯 MVP

**Goal**: Permitir acesso direto, atualização e fallback seguro em rotas públicas do projeto

**Independent Test**: Abrir `/opportunities`, atualizar o navegador e abrir uma rota conhecida ou desconhecida em uma sessão nova

### Tests for User Story 1

- [X] T007 [US1] Adicionar teste E2E de acesso direto a `/opportunities` em `frontend/e2e/layout-navigation.spec.ts`
- [X] T008 [US1] Adicionar teste E2E de atualização da página em `/opportunities` em `frontend/e2e/layout-navigation.spec.ts`
- [X] T009 [US1] Adicionar teste E2E de `/opportunities` com e sem barra final, rota conhecida de detalhes e fallback de rota desconhecida em `frontend/e2e/layout-navigation.spec.ts`

### Implementation for User Story 1

- [X] T010 [US1] Implementar o fallback estático de `PublicApplicationRoute.fallbackFile` no workflow `.github/workflows/ci-cd.yml`, citando `data-model.md` como a cópia de `index.html` para `404.html`
- [X] T011 [US1] Validar que `PublicApplicationRoute.basePrefix` permanece `/best-trade-cs2/` no argumento `--base-href` em `.github/workflows/ci-cd.yml`, conforme `data-model.md`
- [X] T012 [US1] Confirmar em `frontend/src/app/app.routes.ts` que `PublicApplicationRoute.targetRoute` resolve `/opportunities`, `/opportunities/:skinId` e que o wildcard desconhecido resolve para `/opportunities`, conforme `data-model.md`
- [X] T013 [US1] Gerar o build publicado e confirmar a presença de `frontend/dist/frontend/browser/index.html` e `frontend/dist/frontend/browser/404.html`
- [X] T014 [US1] Executar os testes E2E desta história em `frontend/e2e/layout-navigation.spec.ts`

**Checkpoint**: A URL publicada `/best-trade-cs2/opportunities` funciona diretamente e após atualização

---

## Phase 4: User Story 2 - Reconhecer o nome correto da marca (Priority: P1)

**Goal**: Exibir "Best Trade CS2" de forma consistente no shell e no título do navegador

**Independent Test**: Abrir a aplicação e confirmar o nome no shell e no título sem encontrar "CS2 Market"

### Tests for User Story 2

- [X] T015 [P] [US2] Atualizar o teste unitário do shell para exigir `BrandIdentity.displayName = "Best Trade CS2"` em `frontend/src/app/shared/layout/app-shell.component.spec.ts`
- [X] T016 [P] [US2] Atualizar o teste E2E para exigir "Best Trade CS2" e rejeitar "CS2 Market" em `frontend/e2e/layout-navigation.spec.ts`

### Implementation for User Story 2

- [X] T017 [US2] Substituir a identificação visível "CS2 Market" por `BrandIdentity.displayName` como "Best Trade CS2" em `frontend/src/app/shared/layout/app-shell.component.ts`, conforme `data-model.md`
- [X] T018 [US2] Substituir o título `Frontend` por `BrandIdentity.pageTitle = "Best Trade CS2"` em `frontend/src/index.html`, conforme `data-model.md`
- [X] T019 [US2] Executar o teste unitário do shell em `frontend/src/app/shared/layout/app-shell.component.spec.ts`
- [X] T020 [US2] Executar o teste E2E da identidade em `frontend/e2e/layout-navigation.spec.ts`
- [X] T021 [US2] Confirmar que os rótulos existentes "Oportunidades", "Mercado" e "Dados demonstrativos" permanecem visíveis após o ajuste da marca em `frontend/e2e/layout-navigation.spec.ts`

**Checkpoint**: A marca é consistente no shell e no título sem referências visíveis a "CS2 Market"

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validações finais que abrangem ambas as histórias

- [X] T022 [P] Buscar referências visíveis de "CS2 Market" em `frontend/src/index.html` e `frontend/src/app/`
- [X] T023 [P] Executar a suite unitária completa em `frontend/src`
- [X] T024 [P] Executar a suite E2E completa em `frontend/e2e`
- [X] T025 Gerar o build de produção com `/best-trade-cs2/` em `frontend/dist/frontend/browser`
- [X] T026 Validar os cenários do guia em `specs/004-github-pages-brand/quickstart.md`
- [X] T027 Revisar o diff final para garantir que dados simulados, cálculos, filtros e tema não foram alterados

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências; pode iniciar imediatamente
- **Foundational (Phase 2)**: Depende da conclusão do Setup; bloqueia todas as user stories
- **User Stories (Phase 3+)**: Dependem da conclusão da Phase 2 e podem executar em paralelo
- **Polish (Final Phase)**: Depende da conclusão das histórias desejadas

### User Story Dependencies

- **US1 (P1)**: Pode iniciar após a Phase 2; não depende de US2
- **US2 (P1)**: Pode iniciar após a Phase 2; não depende de US1

### Within Each User Story

- Testes são escritos antes da implementação
- Artefatos compartilhados são confirmados antes dos testes específicos
- Implementação concluída antes da validação independente
- O checkpoint da história é validado antes da fase seguinte

### Parallel Opportunities

- T002 e T003 podem executar em paralelo
- T007, T008 e T009 devem ser agrupadas na mesma edição de `frontend/e2e/layout-navigation.spec.ts`
- T015 e T016 podem executar em paralelo em arquivos diferentes
- T022, T023 e T024 podem executar em paralelo após as implementações
- US1 e US2 podem executar em paralelo depois da Phase 2

---

## Parallel Example: User Story 1

```text
T007 [US1] Adicionar teste E2E de acesso direto
T008 [US1] Adicionar teste E2E de atualização
T009 [US1] Adicionar testes E2E de barra final, rota conhecida de detalhes e rota desconhecida
```

## Parallel Example: User Story 2

```text
T015 [P] [US2] Atualizar teste unitário da marca
T016 [P] [US2] Atualizar teste E2E da marca
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational
3. Completar Phase 3: US1
4. **STOP and VALIDATE**: confirmar `/opportunities` direto e após reload
5. Publicar como incremento de roteamento antes da marca

### Incremental Delivery

1. Completar Setup e Foundational
2. Entregar US1: acesso direto no GitHub Pages
3. Entregar US2: identidade Best Trade CS2
4. Executar Polish e publicar a versão completa

### Parallel Team Strategy

Com mais de um responsável:

1. Completar Setup e Foundational em conjunto
2. Responsável A implementa US1
3. Responsável B implementa US2
4. Ambos executam a validação final de forma independente

---

## Notes

- Tarefas marcadas [P] são independentes quanto a arquivos e dependências
- Atributos [US1] e [US2] permitem rastreabilidade até os cenários da especificação
- O MVP recomendado é a conclusão completa da User Story 1
- Cada tarefa inclui um caminho explícito
