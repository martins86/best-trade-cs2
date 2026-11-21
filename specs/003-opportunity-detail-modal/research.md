# Research: Modal de Detalhes das Oportunidades

## Modal

**Decision**: Usar `MatDialog` do Angular Material 22, aberto por `OpportunityListPage` após receber a ação emitida pela tabela.

**Rationale**: A biblioteca já está instalada e oferece foco, Escape, backdrop, travamento de foco e restauração do elemento acionador. A página já possui o repositório necessário para resolver as referências de compra e venda; a tabela permanece responsável apenas pela apresentação e emissão da linha selecionada.

**Alternatives considered**:
- Abrir `MatDialog` diretamente na tabela: rejeitada porque a tabela não possui o repositório usado para resolver as referências de compra e venda.
- Navegar para a página de detalhe existente: rejeitada porque altera a tela e perde o contexto visual direto da tabela.
- Implementar uma modal HTML/CSS própria: rejeitada por duplicar comportamento de acessibilidade já fornecido pelo CDK Dialog.

## Ícone da ação

**Decision**: Usar `visibility` em um `button mat-icon-button` com `aria-label` contendo a skin e a ação.

**Rationale**: O símbolo comunica consulta sem texto visível e mantém consistência com Angular Material. O rótulo acessível preserva a descoberta por tecnologias assistivas.

**Alternatives considered**:
- Manter texto `Detalhes` com ícone: rejeitada por contrariar a substituição total solicitada.
- Usar `open_in_new`: rejeitada por sugerir navegação, embora o comportamento seja modal.

## Origem dos dados

**Decision**: Passar `OpportunityScenario`, `PriceReference` de compra e venda e o nome da skin por `MAT_DIALOG_DATA`.

**Rationale**: A tabela já possui os cenários derivados e resolve os dados locais antes de abrir a modal. O componente apresenta, mas não recalcula, os valores.

**Alternatives considered**:
- Recalcular na modal a partir dos IDs: rejeitada por duplicar o domínio e aumentar risco de inconsistência.
- Navegar e reconstruir a comparação: rejeitada por alterar rota e contexto da lista.

## Comportamento responsivo

**Decision**: Usar largura responsiva com largura máxima, rolagem do CDK/elemento de diálogo e altura máxima próxima à viewport.

**Rationale**: Mantém o conteúdo completo em celular sem remover o botão de fechar ou recortar a comparação.

**Alternatives considered**:
- Layout fixo: rejeitado por não cumprir os viewports de 320 px.
- Uma página substituta em celular: rejeitada por contrariar a modal em todos os tamanhos.

## Tema e movimento

**Decision**: Usar tokens globais existentes e os estilos da comparação atual. Não criar lógica adicional de tema na modal.

**Rationale**: O tema já é aplicado pela raiz da aplicação e deve ser herdado automaticamente pelos componentes overlay do Angular Material.

**Alternatives considered**:
- Estado próprio de tema na modal: rejeitado por criar duplicação e risco de descompasso.
- Animação obrigatória: rejeitada porque o usuário deve conseguir operar com movimento reduzido.
