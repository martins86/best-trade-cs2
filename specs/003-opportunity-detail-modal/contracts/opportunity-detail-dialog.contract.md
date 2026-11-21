# Contract: Opportunity Detail Dialog

## Purpose

Descrever o contrato interno da interação local entre tabela e modal. Não é uma API HTTP.

## Open action

- Receiver: `OpportunityListPage`
- Trigger: evento `detail` emitido por `OpportunityTableComponent` para uma linha válida
- Input:
  - `scenario: OpportunityScenario` emitido pela tabela
  - `buy: PriceReference` resolvida pela página
  - `sell: PriceReference` resolvida pela página
  - `skinName: string`
- Preconditions:
  - `scenario.status === 'valid'`
  - A página encontra as referências de compra e venda
- Outcome:
  - Abre `OpportunityDetailDialogComponent`
  - Não altera o router nem recria filtros

## Dialog result

- Possible result: closed without data
- The dialog must restore focus to the originating icon button after closure
- Closing must not emit filter changes or route changes
- Clicking the backdrop closes the dialog

## Rendering

- Title: name of the selected skin
- Body: `OpportunityComparisonComponent`
- Close control: icon button with accessible label
- Theme: inherited from the active application theme
- Backdrop: dark semitransparent layer with opacity of at least 0.5
- Invalid state: dialog cannot be opened
