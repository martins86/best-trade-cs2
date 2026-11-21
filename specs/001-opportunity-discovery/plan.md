# Implementation Plan: Descoberta de Oportunidades Simuladas

**Branch**: `001-opportunity-discovery` | **Date**: 2026-11-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification in `specs/001-opportunity-discovery/spec.md`

## Summary

Deliver uma lista e um comparador de oportunidades de skins construídos exclusivamente com dados
simulados. A aplicação calcula e apresenta separadamente os sentidos Steam → CSFloat e
CSFloat → Steam, inclui taxas e conversão em BRL, identifica dados incompletos ou desatualizados,
e oferece filtros e ordenação. O front-end usa fixtures locais, cálculos testáveis fora da
apresentação e não depende de backend, persistência ou serviços externos.

## Technical Context

**Language/Version**: TypeScript, na versão suportada pelo Angular 22.x selecionado

**Primary Dependencies**: Angular 22.x standalone, Angular Material 22.x, Decimal.js para
aritmética monetária; Angular Signals para estado local. Apache ECharts não é necessário neste
fluxo, que não contém gráficos.

**Storage**: Nenhum. Fixtures TypeScript estáticas no front-end.

**Testing**: Vitest com utilitários de teste Angular para unidades e componentes; Playwright para
o fluxo de aceitação no navegador.

**Target Platform**: Navegadores modernos em desktop, tablet e celular.

**Project Type**: Aplicação web front-end (SPA) em `frontend/`.

**Performance Goals**: Para até 200 cenários locais, a lista atualizada após mudança de filtro ou
ordenação deve ficar visível em até 200 ms no percentil 95, em 30 execuções no Chromium do
Playwright. A medição exclui rede; nenhum endpoint externo é consultado nesta feature.

**Constraints**: Somente dados simulados; cada preço e horário deve ser reconhecível como fictício.
Referências com mais de 24 horas em relação ao horário fixo do conjunto são desatualizadas.
Valores monetários usam decimal de precisão explícita, não ponto flutuante binário.

**Scale/Scope**: Uma experiência de descoberta e comparação para até 100 identidades de skins e
200 cenários direcionais, três estados de resultado (positivo, nulo e negativo), fixtures locais
e filtros combináveis. Sem usuários, autenticação, backend, persistência ou integrações externas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / restrição | Verificação neste plano | Resultado |
|---|---|---|
| Especificação aprovada antes da implementação | A feature possui spec e clarification registradas | PASS |
| Dados simulados transparentes | Fixtures e interface rotulam preços, taxas, câmbio e horários como simulados | PASS |
| Cálculos confiáveis | Regras ficam em funções puras com Decimal.js e testes de aplicação de taxas, fórmula e arredondamento | PASS |
| Qualidade e acessibilidade | Testes unitários, de componentes e fluxo no navegador; navegação por teclado e layout responsivo | PASS |
| Simplicidade e escopo | SPA e fixtures locais; sem backend, armazenamento, APIs ou operações financeiras | PASS |

**Gate pré-design**: PASS. Nenhuma violação da constituição identificada.

## Project Structure

### Documentation (this feature)

```text
specs/001-opportunity-discovery/
├── plan.md              # Este plano
├── research.md          # Decisões e alternativas
├── data-model.md        # Modelo de dados da feature
├── quickstart.md        # Guia de execução e validação
└── tasks.md             # Próxima fase (/speckit-tasks)
```

### Source Code (repository root)

```text
frontend/
├── package.json
├── angular.json
├── e2e/
└── src/
    └── app/
        ├── core/
        ├── shared/
        └── features/
            └── opportunities/
                ├── data/
                ├── domain/
                ├── pages/
                └── ui/
```

**Structure Decision**: Um único projeto Angular em `frontend/`, organizado por feature. A pasta
`domain/` concentra equivalência, validação e cálculos puros; `data/` contém fixtures e o acesso
local a elas; `pages/` orquestra o fluxo e `ui/` reúne componentes de apresentação. Testes unitários
e de componentes ficam próximos ao código; o fluxo Playwright fica em `frontend/e2e/`. Não há
diretórios de backend, contratos externos ou camadas de persistência.

## Constitution Check — Pós-design

| Princípio / restrição | Evidência do design | Resultado |
|---|---|---|
| Especificação orienta implementação | Modelo e fluxos referenciam FR-001–FR-015, SC-001–SC-009 e cenários de aceitação | PASS |
| Transparência | Fixtures e componentes carregam origem simulada e horário de referência | PASS |
| Cálculos confiáveis | Decimal.js, alocação explícita de taxas, funções puras e casos de teste determinísticos | PASS |
| Qualidade e acessibilidade | Vitest, Playwright e verificações de teclado, foco, contraste e viewports | PASS |
| Simplicidade | Sem APIs, backend, armazenamento, ECharts ou abstrações futuras não necessárias | PASS |

**Gate pós-design**: PASS. Sem violações a justificar.
