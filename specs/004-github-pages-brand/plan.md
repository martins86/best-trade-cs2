# Implementation Plan: Roteamento GitHub Pages e Marca

**Branch**: `004-github-pages-brand` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-github-pages-brand/spec.md`

## Summary

Ajustar a publicação estática para que URLs internas conhecidas do Angular funcionem diretamente no GitHub Pages e atualizar a identidade visível da aplicação de "CS2 Market" para "Best Trade CS2". A implementação permanecerá no front-end, com fallback da aplicação para rotas desconhecidas e sem alteração de dados, cálculos ou comportamento financeiro.

## Technical Context

**Language/Version**: TypeScript 6, Angular 22

**Primary Dependencies**: Angular Router, Angular Material 22

**Storage**: N/A

**Testing**: Vitest para testes unitários; Playwright para testes E2E

**Target Platform**: Navegadores modernos com publicação no GitHub Pages

**Project Type**: Aplicação web front-end estática

**Performance Goals**: Manter carregamento inicial e navegação existentes; nenhuma etapa adicional em tempo de execução deve adicionar chamada de rede

**Constraints**: GitHub Pages somente distribui arquivos estáticos; o prefixo público é `/best-trade-cs2/`; o site não possui servidor para reescrever rotas

**Scale/Scope**: Shell de aplicação existente e duas rotas conhecidas de oportunidades

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Especificações aprovadas antes da implementação**: aprovado pela feature `004-github-pages-brand`; sem conflito.
- **Dados simulados**: não há alteração em preços, cálculos ou apresentação financeira; aprovado.
- **Qualidade verificável**: o plano inclui testes unitários e E2E para rota direta e identidade da marca; aprovado.
- **Simplicidade**: fallback estático e ajuste de texto são suficientes; não há novo backend ou abstração desnecessária; aprovado.

Nenhuma exceção ou complexidade adicional necessita justificativa.

## Project Structure

### Documentation (this feature)

```text
specs/004-github-pages-brand/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── app.routes.ts
│   │   └── shared/layout/
│   │       ├── app-shell.component.ts
│   │       └── app-shell.component.spec.ts
│   └── index.html
└── angular.json

.github/
└── workflows/
    └── ci-cd.yml
```

**Structure Decision**: Aplicação web front-end única. O ajuste envolve o shell, o título HTML, o fluxo de publicação e os testes E2E/unitários. Os artefatos permanecem dentro da feature Spec Kit.

## Complexity Tracking

Nenhuma violação da constituição ou justificativa de complexidade.
