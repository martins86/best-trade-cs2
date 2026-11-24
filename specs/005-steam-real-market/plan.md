# Implementation Plan: Dados reais da Steam no front-end

**Branch**: `005-steam-real-market` | **Date**: 2026-11-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from [spec.md](spec.md)

## Summary

Substituir gradualmente os fixtures da experiência existente por itens reais obtidos da API pública de busca do marketplace da Steam. A primeira entrega consulta appid 730, ordena por popularidade/trend, retorna páginas de até 20 itens e usa `sell_price` como menor preço anunciado. Um serviço Angular normaliza, valida e cacheia a resposta em memória; a interface apresenta estados de carregamento, erro, atualização e fim de lista.

Não haverá backend Java, banco PostgreSQL, persistência, autenticação Steam, integração CSFloat ou registro financeiro nesta feature.

## Technical Context

**Language/Version**: TypeScript 6 / Angular 22

**Primary Dependencies**: Angular standalone components, Angular Material, RxJS, Decimal.js

**Storage**: Cache em memória no front-end; sem banco ou armazenamento persistente

**Testing**: Vitest para domínio e serviços; Playwright para fluxo navegador

**Target Platform**: Navegador moderno desktop, tablet e celular; GitHub Pages

**Project Type**: SPA front-end em `frontend/`

**Performance Goals**: Página revisitada em cache em até 200 ms no percentil 95; retorno máximo de 20 itens

**Constraints**: Dados públicos da Steam; respeito a limites e respostas da Steam; sem CORS assumido; sem credenciais no front-end

**Scale/Scope**: Primeira integração real, uma origem de dados, navegação paginada e cache de sessão

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Resultado |
|---|---|
| Especificação aprovada antes da implementação | PASS — spec 005 aprovada |
| Dados reais transparentes | PASS — origem Steam, horário e estado serão exibidos |
| Cálculos confiáveis | PASS — preços monetários usam Decimal.js |
| Qualidade e acessibilidade | PASS — testes unitários e Playwright planejados |
| Simplicidade | PASS — sem backend, banco, autenticação ou operações financeiras |

## Project Structure

### Documentation (this feature)

```text
specs/005-steam-real-market/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

### Source Code (repository root)

```text
frontend/
└── src/
    └── app/
        └── features/
            └── steam-market/
                ├── data/
                ├── domain/
                ├── pages/
                └── ui/
```

**Structure Decision**: manter uma SPA Angular organizada por feature. Um adaptador dedicado traduz a resposta pública da Steam em modelos do domínio; o serviço mantém cache em memória e cancela consultas obsoletas. Nenhuma API própria ou persistência será criada.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Nenhuma no momento | — | O fluxo permanece no front-end e usa cache em memória |

## Transport decision

Production will use an approved same-origin or CORS-enabled edge gateway that forwards the public Steam search endpoint. Direct browser access will not be assumed as a production default. The gateway will not own a database, account login or persistent state.

The deployment configuration will define gateway URL, allowed browser origin, request timeout, retry behavior and the maximum request count before rate-limit handling.
