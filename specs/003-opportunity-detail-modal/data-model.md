# Data Model: Modal de Detalhes das Oportunidades

A feature não cria entidades financeiras novas. Ela define apenas o contexto temporário usado pelo diálogo.

## DetailAction

Representa a ação de abrir detalhe associada a uma linha válida.

| Campo | Tipo | Regra |
|---|---|---|
| opportunity | `OpportunityScenario` | Deve ter `status = valid` |
| skinName | string | Nome exibido na tabela |
| ariaLabel | string | Inclui `Ver detalhes de` e o nome da skin |
| icon | string | Símbolo Material usado visualmente |

A ação não aparece como válida para cenários incompletos, desatualizados ou não equivalentes.

## DialogContext

É o payload mínimo enviado por `MAT_DIALOG_DATA`.

| Campo | Tipo | Regra |
|---|---|---|
| scenario | `OpportunityScenario` | Obrigatório e válido |
| buy | `PriceReference` | Obrigatório |
| sell | `PriceReference` | Obrigatório |
| skinName | string | Obrigatório |

## Relações

- `OpportunityTableComponent` gera uma `DetailAction` por cenário válido e emite o `OpportunityScenario` selecionado.
- `OpportunityListPage` resolve as referências de compra e venda e abre o diálogo com um `DialogContext` completo.
- O diálogo apresenta o `DialogContext` pelo `OpportunityComparisonComponent` já existente, sem recalcular valores.
