# Feature Specification: Refactor do Layout Angular

**Feature Branch**: `002-angular-layout-refactor`

**Created**: 2026-11-21

**Status**: Draft

**Input**: User description: "Aplicar o layout de referência do CS2 Market Manager ao MVP existente com Angular Material, mantendo dados simulados e sem ampliar o escopo financeiro ou técnico."

## Referencia visual

O arquivo [docs/cs2-market-manager-layout.html](../../docs/cs2-market-manager-layout.html) é a referência visual aprovada para esta feature. Ele define a direção geral de identidade, densidade, hierarquia e comportamento responsivo do shell da aplicação.

A referência visual NÃO autoriza dados reais, ações financeiras, integração com marketplaces, autenticação ou criação das páginas futuras identificadas apenas como navegação ilustrativa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar em uma estrutura operacional consistente (Priority: P1)

Como usuário do MVP, quero navegar por uma estrutura lateral e superior consistente para encontrar rapidamente oportunidades, filtros e informações da aplicação.

**Why this priority**: O shell é compartilhado por todas as telas e precisa estabelecer a hierarquia visual antes do conteúdo refinado.

**Independent Test**: Abrir a aplicação em desktop, tablet e celular e confirmar que a navegação alcança a lista e o detalhe de oportunidade, respeita o caminho atual e não apresenta itens de páginas não implementadas como ações disponíveis.

**Acceptance Scenarios**:

1. **Given** o usuário está em desktop, **When** a aplicação é aberta, **Then** uma barra lateral fixa apresenta o nome da aplicação, seções de mercado e uma indicação clara de áreas futuras sem sugerir que estão implementadas.
2. **Given** o usuário está em tablet, **When** a largura da tela reduz o espaço lateral, **Then** o shell preserva os destinos principais com uma apresentação compacta e legível.
3. **Given** o usuário está em celular, **When** abre o menu, **Then** consegue navegar pelos destinos disponíveis, fechar o menu e continuar usando a tela atual por toque ou teclado.
4. **Given** o usuário navega para o detalhe de uma oportunidade, **When** muda de rota, **Then** o título, breadcrumb ou indicador de localização permanece coerente com a tela ativa.

---

### User Story 2 - Alternar tema claro e escuro (Priority: P1)

Como usuário, quero alternar entre temas claro e escuro para usar a aplicação com conforto visual sem perder o contexto atual.

**Why this priority**: Tema é parte central da referência visual e deve funcionar de forma persistente em todas as telas do MVP.

**Independent Test**: Alternar tema em uma tela, navegar para outra rota e recarregar a aplicação, confirmando persistência e contraste adequado.

**Acceptance Scenarios**:

1. **Given** a aplicação está no tema escuro, **When** o usuário ativa o tema claro, **Then** toda a superfície principal, navegação, campos e estados mudam para o tema correspondente.
2. **Given** o usuário escolheu um tema, **When** navega ou recarrega a aplicação, **Then** a preferência permanece aplicada.
3. **Given** o usuário utiliza teclado ou tecnologias assistivas, **When** encontra o controle de tema, **Then** identifica sua ação pelo rótulo acessível e recebe foco visível.
4. **Given** o tema escuro está ativo, **When** o usuário consulta qualquer rota da aplicação, **Then** textos principais, secundários, rótulos e valores permanecem claros sobre superfícies escuras e nenhum componente usa fundo claro ou texto escuro incompatível sem uma intenção explícita.

---

### User Story 3 - Consultar o panorama operacional de oportunidades (Priority: P1)

Como usuário, quero visualizar indicadores e uma tabela de oportunidades no mesmo padrão visual da referência para comparar cenários com leitura rápida.

**Why this priority**: A primeira feature já entrega descoberta e comparação; o novo layout deve tornar essa entrega mais escaneável sem alterar as regras financeiras.

**Independent Test**: Abrir a tela principal com fixtures locais e confirmar indicadores, tabela, estado vazio, dados simulados e navegação para detalhes.

**Acceptance Scenarios**:

1. **Given** existem cenários simulados válidos, **When** o usuário abre o panorama, **Then** a página apresenta indicadores derivados da lista local e uma tabela responsiva com nome, direção, compra, venda, resultado, margem e liquidez.
2. **Given** o usuário consulta um resultado negativo ou nulo, **When** ele aparece na tabela, **Then** continua visível e é identificado como não lucrativo, sem ser apresentado como oportunidade lucrativa.
3. **Given** uma venda ocorre na Steam, **When** o resultado é exibido, **Then** o usuário vê que o saldo recebido é da carteira Steam e não dinheiro sacável.
4. **Given** não há cenários correspondentes aos filtros, **When** a atualização da tabela ocorre, **Then** a interface apresenta estado vazio com uma ação para limpar os filtros.
5. **Given** existe apenas uma comparação incompleta ou desatualizada, **When** ela é exibida, **Then** o estado impedido é claro e nenhum cálculo inválido é apresentado como resultado válido.

---

### User Story 4 - Usar filtros em uma barra compacta (Priority: P2)

Como usuário, quero aplicar pesquisa e filtros por controles claros e compactos para reduzir a tabela sem perder contexto.

**Why this priority**: A referência utiliza ferramentas de filtragem na área de tabela e no cabeçalho; o comportamento existente precisa permanecer completo no novo layout.

**Independent Test**: Aplicar pesquisa, margem, liquidez e direção combinados e confirmar que somente os cenários atendendo a todos os critérios permanecem na tabela e que limpar restaura o conjunto inicial.

**Acceptance Scenarios**:

1. **Given** o usuário informa parte do nome da skin, **When** a pesquisa muda, **Then** a tabela atualiza independentemente de caixa alta ou baixa.
2. **Given** filtros válidos são combinados, **When** a tabela atualiza, **Then** todos os critérios ativos são aplicados em conjunto.
3. **Given** custo mínimo é maior que custo máximo, **When** o usuário aplica a faixa, **Then** a interface informa a faixa inválida e não apresenta resultados como filtrados.
4. **Given** os filtros eliminam todos os cenários, **When** a página atualiza, **Then** a ação de limpar fica disponível no estado vazio e na barra de ferramentas.

---

### User Story 5 - Abrir comparações sem abandonar o shell (Priority: P2)

Como usuário, quero abrir os detalhes de uma oportunidade mantendo o mesmo layout, navegação e tema da experiência principal.

**Why this priority**: O refactor deve preservar a continuidade da jornada atual, não apenas estilizar a página da lista.

**Independent Test**: Navegar da tabela para uma comparação Steam → CSFloat e CSFloat → Steam e voltar pela interação disponível sem perder tema ou filtros quando aplicável.

**Acceptance Scenarios**:

1. **Given** o usuário seleciona uma linha com dados válidos, **When** abre a comparação, **Then** o conteúdo detalha compra, venda, taxas, conversão, custo, resultado, margem e natureza do valor recebido dentro do shell atual.
2. **Given** o usuário abre uma comparação de venda na Steam, **When** examina o resultado, **Then** esse sentido permanece identificado como crédito não sacável.
3. **Given** o usuário utiliza teclado, **When** navega de um resultado para o detalhe e volta, **Then** foco, ordem de leitura e contexto permanecem utilizáveis.
4. **Given** o tema escuro está ativo na lista, **When** o usuário abre o detalhe, **Then** o detalhe mantém tema escuro, texto legível e superfícies compatíveis com o shell.

### Edge Cases

- Tema salvo pode estar ausente ou conter valor inesperado: usar tema escuro como padrão seguro e ignorar valor inválido.
- A tela pode ter largura menor que 600 px: apresentar navegação inferior ou menu temporário sem ocultar a tabela principal ou o conteúdo essencial.
- O navegador pode não suportar recursos modernos de apresentação usados pela referência: manter tema, contraste, navegação e leitura textual.
- O conjunto pode conter menos itens que a tabela ilustrativa: adaptar contadores e mensagens sem inventar dados ou preencher com registros fictícios adicionais.
- Dados incompletos ou desatualizados podem existir junto de cenários válidos: cada estado permanece isolado sem transformar dados válidos em indisponíveis.
- A tabela pode ultrapassar a largura disponível: permitir rolagem horizontal controlada com cabeçalhos legíveis e sem recorte da navegação principal.
- O usuário pode desabilitar animações no sistema: respeitar preferência de movimento reduzido e não depender de animação para usar controles.
- Ícones Material podem não carregar quando a fonte ou os estilos do pacote não forem fornecidos: a interface não pode depender apenas de uma fonte externa para funções essenciais e os ícones devem ter alternativa textual ou rótulo acessível.
- Uma rota pode herdar estilos de componentes diferentes da página anterior: tema, fundo e cores de texto devem ser definidos pelas superfícies globais e não por estilos isolados do componente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST usar o arquivo de referência visual como padrão para hierarquia, densidade, bordas, superfícies, tipografia, estados, navegação e responsividade, sem copiar texto demonstrativo que represente dados como reais.
- **FR-002**: O sistema MUST apresentar um shell persistente com sidebar em desktop, apresentação compacta em tablet e menu ou navegação inferior em celular.
- **FR-003**: O sistema MUST indicar claramente quais destinos da navegação estão implementados e quais são apenas futuros ou demonstrativos.
- **FR-004**: O sistema MUST fornecer tema claro e escuro, persistir a escolha e manter contraste suficiente para texto, bordas, campos e estados.
- **FR-005**: O sistema MUST manter a navegação por teclado, foco visível, rótulos acessíveis e ordem lógica de leitura em controles e conteúdo.
- **FR-006**: O sistema MUST reapresentar a descoberta de oportunidades em uma tabela ou lista responsiva baseada no modelo de referência, com nome da skin, direção, compra, venda, resultado líquido, margem e liquidez.
- **FR-007**: O sistema MUST manter explicitamente os rótulos de dados simulados e o horário fictício de referência em todas as visualizações derivadas das fixtures.
- **FR-008**: O sistema MUST continuar exibindo resultados nulos e negativos como cenários não lucrativos sem ocultá-los da lista.
- **FR-009**: O sistema MUST continuar distinguindo crédito da carteira Steam de dinheiro sacável em toda tabela, detalhe e resumo.
- **FR-010**: O sistema MUST manter pesquisa por nome, filtro de direção, liquidez mínima, margem mínima e faixa de custo válida com limites inclusivos.
- **FR-011**: O sistema MUST mostrar estado vazio, estado incompleto, estado desatualizado e estado não equivalente sem apresentar cálculos inválidos como disponíveis.
- **FR-012**: O sistema MUST oferecer uma ação clara para limpar filtros a partir do estado vazio e da área de filtros.
- **FR-013**: O sistema MUST manter os dados e cálculos existentes isolados da apresentação, sem duplicar regras financeiras nos componentes visuais.
- **FR-014**: O sistema MUST adaptar indicadores e contadores ao conjunto real de dados locais, sem apresentar valores ilustrativos como métricas efetivas.
- **FR-015**: O sistema MUST respeitar preferência de movimento reduzido e não depender de animação para navegação ou operação dos controles.
- **FR-016**: O sistema MUST manter todas as rotas atuais de lista e detalhe funcionando após o refactor.
- **FR-017**: O sistema MUST NOT adicionar backend, APIs reais, persistência externa, autenticação, histórico real, carteira, compras, vendas, saques ou conexões com marketplaces.
- **FR-018**: O sistema MUST renderizar ícones de navegação e ações com os recursos visuais disponíveis do Angular Material e MUST manter rótulo acessível ou alternativa textual quando o glifo não estiver disponível.
- **FR-019**: Em tema escuro, o sistema MUST aplicar contraste adequado a textos principais, secundários, rótulos, valores e estados em todas as superfícies, inclusive página de detalhe.
- **FR-020**: Ao abrir ou navegar para uma rota de detalhe, o sistema MUST preservar o tema ativo da aplicação em vez de inicializar ou herdar uma combinação visual diferente.
- **FR-021**: Os itens da navegação lateral MUST alinhar ícone e texto no mesmo eixo vertical, usar ícones proporcionais ao rótulo e manter 6 px de espaçamento vertical entre os destinos.

### Key Entities *(include if feature involves data)*

- **ApplicationShell**: estrutura compartilhada que contém navegação, cabeçalho, tema e área de conteúdo.
- **NavigationDestination**: destino disponível ou futuro, com rótulo, estado ativo e indicação de implementação.
- **ThemePreference**: preferência persistida pelo usuário entre tema claro e escuro.
- **OpportunityRow**: representação visual de um cenário existente, incluindo skin, direção, valores, margem e liquidez.
- **DashboardIndicator**: métrica derivada dos cenários locais simulados para resumo operacional.
- **FilterState**: critérios ativos usados pela tela de descoberta sem alterar as regras financeiras.

## Success Criteria *(mandatory)

### Measurable Outcomes

- **SC-001**: Em 100% das rotas implementadas, o usuário percebe navegação, título da área atual e indicação de dados simulados de forma consistente.
- **SC-002**: Em um conjunto de até 200 cenários locais, filtros e ordenação continuam atualizando a tabela visível em até 200 ms no percentil 95 em 30 execuções.
- **SC-003**: Pelo menos 95% das interações principais do fluxo de descoberta e comparação são concluídas por teclado em testes automatizados ou manuais.
- **SC-004**: A interface mantém legibilidade e operação completa em larguras de 320 px, 768 px e 1440 px, sem conteúdo essencial recortado ou sobreposto.
- **SC-005**: Tema claro e escuro são aplicados em todas as superfícies principais e o tema escolhido persiste após recarregar a página.
- **SC-006**: Nenhuma métrica, tabela ou gráfico apresenta dados fictícios como coleta ou resultado real.
- **SC-007**: Todas as linhas válidas podem alcançar seu detalhe e todas as linhas inválidas permanecem claramente marcadas sem cálculo válido.
- **SC-008**: Em testes de contraste e inspeção manual, textos principais e estados críticos atingem contraste legível e não dependem exclusivamente de cor para comunicar status.
- **SC-009**: O shell e os componentes visuais continuam navegáveis quando animações e efeitos visuais são desabilitados.

## Assumptions

- A experiência inicial será o painel de oportunidades, não um dashboard com dados financeiros reais ou módulos futuros.
- Métricas no topo serão derivadas dos cenários locais existentes e podem ser menos numerosas que os valores ilustrativos da referência.
- Conteúdos futuros da sidebar serão indicados apenas como não disponíveis e não abrirão telas vazias ou funcionalidades fictícias.
- Valores de tema, layout e preferências podem ser persistidos localmente no navegador, mas nenhum dado de mercado será persistido externamente.
- Dados e cotações continuam fixos e simulados; a referência visual não introduz atualização automática.
- O refactor preserva o conjunto de dados e as fórmulas da feature 001.
