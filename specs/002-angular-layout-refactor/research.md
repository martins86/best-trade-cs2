# Research: Refactor do Layout Angular

**Data**: 2026-11-21

## Shell e navegação

**Decisão**: Usar componentes de layout próprios com Angular Material para superfície e navegação.

**Rationale**: O layout da referência exige sidebar fixa, controles compactos e menu móvel. Material Sidenav, Toolbar, Button, Icon e List oferecem navegação acessível sem introduzir uma dependência nova de shell.

**Alternativas consideradas**: Implementar toda a navegação com CSS e elementos HTML, ou adicionar uma biblioteca completa de dashboard. Rejeitadas por duplicar comportamento já disponível no projeto Material e aumentar o risco de inconsistências de acessibilidade.

## Tema claro e escuro

**Decisão**: Implementar um serviço de tema com Signals e persistência da preferência no `localStorage` do navegador.

**Rationale**: Tema é uma preferência local da interface e não pertence ao domínio de oportunidades. Valor inválido ou ausente volta ao tema escuro da referência.

**Alternativas consideradas**: Persistir tema em fixtures, backend ou cookies. Rejeitadas por introduzir persistência externa desnecessária e contrariar o MVP local.

## Tabela de oportunidades

**Decisão**: Usar tabela responsiva com Angular Material Table e rolagem horizontal controlada em telas estreitas.

**Rationale**: A tabela oferece semântica forte, ordenação futura e adaptação à estrutura da feature existente. Linhas continuam derivadas do cenário de domínio, não de objetos duplicados.

**Alternativas consideradas**: Cards em todas as larguras ou uma tabela HTML customizada. Cards são úteis no celular, mas não preservam a comparação tabular da referência; tabela HTML customizada duplicaria comportamento já coberto por Material.

## Indicadores

**Decisão**: Derivar indicadores apenas dos cenários locais atuais e não criar gráfico principal nesta fase.

**Rationale**: A referência contém gráfico ilustrativo, mas o MVP não especificou dados históricos nem engenharia de séries temporais. Indicadores podem ser derivados de quantidade, margem, liquidez e natureza dos resultados sem ampliar o domínio.

**Alternativas consideradas**: Criar dados fictícios adicionais ou usar o gráfico da referência como dados reais demonstrativos. Rejeitadas por criar métricas enganosas e ampliar o conjunto de dados.

## Responsividade

**Decisão**: Layout desktop acima de 1200 px, sidebar compacta entre 601 px e 1200 px e menu móvel até 600 px.

**Rationale**: Os breakpoints coincidem com a referência visual e cobrem os success criteria de 320 px, 768 px e 1440 px.

**Alternativas consideradas**: Um único layout fluido sem breakpoints ou ocultação do conteúdo em celular. Rejeitadas por dificultar o uso de navegação e tabela em larguras menores.

## Acessibilidade

**Decisão**: Usar controles Material com foco visível, rótulos explícitos, navegação por teclado e estados sem depender de cor.

**Rationale**: A constituição exige uso por teclado e contraste; componentes Material fornecem semântica e estados adequados, enquanto texto e ícones continuarão identificando status financeiros.

**Alternativas consideradas**: Auditoria visual somente ou adição posterior de acessibilidade. Rejeitadas por não garantir que a nova navegação seja utilizável desde o primeiro incremento.
