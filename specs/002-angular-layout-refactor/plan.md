# Implementation Plan: Refactor do Layout Angular

**Branch**: `002-angular-layout-refactor` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-angular-layout-refactor/spec.md`

## Summary

Refatorar o shell da aplicação Angular existente para aproximá-lo do layout operacional do CS2 Market Manager, usando Angular Material 22. A mudança preservará rotas, fixtures, cálculos, filtros e estados da descoberta já implementada, separando apresentação em componentes de navegação, indicadores, tabela e detalhe. O escopo permanece front-end e exclusivamente demonstrativo.

## Technical Context

**Language/Version**: TypeScript 6.0 com Angular 22.x

**Primary Dependencies**: Angular Material 22, Angular CDK, Angular Router, Angular Signals, Decimal.js já usado no domínio e Vitest/Playwright já configurados

**Storage**: Nenhum armazenamento externo. Apenas preferência de tema no armazenamento local do navegador

**Testing**: Vitest para componentes e estado; Playwright para navegação, tema, responsividade e fluxo da tabela ao detalhe

**Target Platform**: SPA Angular em navegadores modernos, desktop, tablet e celular

**Project Type**: Aplicação web front-end única em `frontend/`

**Performance Goals**: Atualização visível da tabela em até 200 ms no percentil 95 para até 200 cenários locais

**Constraints**: Sem backend, APIs, autenticação, persistência externa ou operações financeiras. Dados fictícios devem continuar visíveis. Layout deve funcionar em 320 px, 768 px e 1440 px

**Scale/Scope**: Uma aplicação SPA com shell compartilhado, tela principal de oportunidades e tela de comparação existente

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / restrição | Verificação no plano | Resultado |
|---|---|---|
| Especificação aprovada | Feature possui spec e checklist base | PASS |
| Dados simulados transparentes | Shell e tabela manterão avisos e horários fictícios | PASS |
| Cálculos confiáveis | Regras financeiras existentes não serão movidas para componentes de apresentação | PASS |
| Qualidade e acessibilidade | Testes, tema, teclado, foco e viewports farão parte das tarefas | PASS |
| Simplicidade e evolução gradual | Shell e telas atuais apenas; sem integrações ou módulos futuros | PASS |

**Gate pré-design**: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/002-angular-layout-refactor/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
├── spec.md
└── checklists/
```

### Source Code (repository root)

```text
frontend/src/app/
├── core/
│   └── theme/
├── shared/
│   └── layout/
└── features/
    └── opportunities/
        ├── data/
        ├── domain/
        ├── pages/
        └── ui/

frontend/e2e/
```

**Structure Decision**: Criar componentes compartilhados de shell em `shared/layout/` e tema em `core/theme/`. Manter os componentes de negócio em `features/opportunities/`. Reutilizar o domínio e o repositório já existentes em vez de duplicar modelos ou cálculos.

## Complexity Tracking

Nenhuma violação da constituição exige justificativa adicional.
