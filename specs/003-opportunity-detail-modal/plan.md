# Implementation Plan: Modal de Detalhes das Oportunidades

**Branch**: `003-opportunity-detail-modal` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-opportunity-detail-modal/spec.md`

## Summary

Substituir a ação textual `Detalhes` da tabela por um botão com ícone Material acessível. Ao ativar o botão, abrir a comparação existente em uma modal Angular Material sem mudar a rota ou recalcular os cenários financeiros.

## Technical Context

<!-- Technical context resolved in research.md. -->

**Language/Version**: TypeScript 6.0 com Angular 22

**Primary Dependencies**: Angular Material 22, Angular CDK Dialog, Angular Signals, Decimal.js, Vitest e Playwright

**Storage**: Nenhum armazenamento externo; filtros e tema continuam em memória/localStorage existentes

**Testing**: Testes Vitest para ação, contexto e estados inválidos; testes Playwright para foco, rota, fechamento e responsividade

**Target Platform**: SPA Angular em navegadores modernos desktop, tablet e celular

**Project Type**: Aplicação web front-end única em `frontend/`

**Performance Goals**: A modal abre imediatamente para cenários já carregados, sem consulta ou recálculo financeiro

**Constraints**: Sem backend, APIs, persistência externa ou operações financeiras. Dados simulados e crédito Steam não sacável permanecem explícitos

**Scale/Scope**: Uma apresentação modal sobre a tabela de oportunidades existente

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / restrição | Verificação no plano | Resultado |
|---|---|---|
| Especificação aprovada | Feature possui spec e checklist completos | PASS |
| Dados simulados transparentes | A modal reutiliza os disclaimers existentes | PASS |
| Cálculos confiáveis | Nenhuma fórmula será movida ou recalculada | PASS |
| Qualidade e acessibilidade | Foco, Escape, rótulo e viewports farão parte dos testes | PASS |
| Simplicidade e evolução gradual | Reutiliza cenário e comparação existentes | PASS |
| Escopo do MVP | Sem backend, integração ou operação financeira | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/003-opportunity-detail-modal/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/opportunity-detail-dialog.contract.md
├── spec.md
└── checklists/
```

### Source Code (repository root)

```text
frontend/src/app/features/opportunities/
├── pages/
│   └── opportunity-list.page.ts
└── ui/
    ├── opportunity-table/
    │   ├── opportunity-table.component.ts
    │   └── opportunity-table.component.scss
    ├── opportunity-comparison/
    │   ├── opportunity-comparison.component.ts
    │   └── opportunity-comparison.component.scss
    └── opportunity-detail-dialog/
        ├── opportunity-detail-dialog.component.ts
        └── opportunity-detail-dialog.component.scss

frontend/e2e/
├── opportunity-layout.spec.ts
└── opportunity-detail-dialog.spec.ts
```

**Structure Decision**: `OpportunityTableComponent` emite a linha válida selecionada; `OpportunityListPage` resolve compra/venda e abre `MatDialog`; `OpportunityDetailDialogComponent` recebe `DialogContext` e reutiliza `OpportunityComparisonComponent`. Não duplicar estado ou cálculos financeiros.

## Complexity Tracking

Nenhuma violação da constituição exige justificativa adicional.
