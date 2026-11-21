# Feature Specification: Modal de Detalhes das Oportunidades

**Feature Branch**: `003-opportunity-detail-modal`

**Created**: 2026-11-21

**Status**: Approved

**Input**: User description: "Trocar o texto Detalhes por um ícone e abrir os detalhes da oportunidade em uma modal, sem abandonar a tela da tabela."

## Referência visual e escopo

A mudança usa a interface operacional já implementada pela feature `002-angular-layout-refactor`. O ícone deve seguir a biblioteca visual Angular Material já utilizada no projeto.

A modal apresenta os dados da comparação existente e permanece dentro do contexto visual da aplicação. Esta feature não adiciona dados reais, integrações, ações financeiras ou persistência externa.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abrir detalhes sem sair da tabela (Priority: P1)

Como usuário da lista de oportunidades, quero abrir a comparação de uma linha em uma modal para consultar os detalhes sem perder a posição e os filtros da tabela.

**Why this priority**: É o principal fluxo da mudança e deve preservar contexto durante a análise rápida de múltiplas oportunidades.

**Independent Test**: Aplicar filtros, clicar no ícone de uma linha válida e confirmar que a comparação aparece em uma modal sobre a lista, sem alterar a URL da tela atual.

**Acceptance Scenarios**:

1. **Given** o usuário consulta uma linha válida na tabela, **When** encontra a ação de detalhe, **Then** vê um botão com ícone acessível e um rótulo para tecnologias assistivas, sem texto visível `Detalhes`.
2. **Given** o usuário clica no ícone de uma linha válida, **When** a comparação é aberta, **Then** uma modal mostra o mesmo conteúdo de compra, venda, taxas, conversão, custo, resultado, margem e natureza do valor recebido.
3. **Given** a modal está aberta sobre a tabela, **When** o usuário fecha a modal, **Then** a tabela permanece na mesma posição, com filtros, ordenação e tema anteriores.
4. **Given** o usuário utiliza teclado, **When** alcança o botão de detalhe, **Then** consegue abrir a modal, navegar pelos elementos ativos, receber foco inicial coerente e retornar o foco ao botão após o fechamento.

---

### User Story 2 - Aplicar modal aos dois sentidos de comparação (Priority: P1)

Como usuário, quero consultar Steam → CSFloat e CSFloat → Steam dentro da mesma modalidade de diálogo para comparar ambos sem trocar de tela.

**Why this priority**: Ambos os sentidos fazem parte da descoberta principal e não podem perder sua distinção ao mudar de navegação para modal.

**Independent Test**: Abrir linhas válidas dos dois sentidos e verificar que cada modal identifica corretamente a direção e a natureza do valor recebido.

**Acceptance Scenarios**:

1. **Given** o usuário abre uma linha Steam → CSFloat, **When** a modal é exibida, **Then** os dados permanecem identificados como esse sentido e os valores simulados permanecem claros.
2. **Given** o usuário abre uma linha CSFloat → Steam, **When** a modal é exibida, **Then** o sentido permanece separado e o crédito Steam é identificado como não sacável.
3. **Given** uma linha não possui cálculo válido, **When** o usuário consulta suas ações, **Then** o ícone de detalhe não permite abrir uma comparação inválida.

---

### User Story 3 - Fechar e navegar pela modal com segurança (Priority: P2)

Como usuário, quero fechar a modal por métodos previsíveis e sem efeitos colaterais para continuar a análise da tabela.

**Why this priority**: Previsibilidade de fechamento e acessibilidade são necessárias em uma interação modal sobre a tabela.

**Independent Test**: Abrir e fechar a modal por botão, clique no fundo e tecla Escape, quando disponíveis, em desktop e celular.

**Acceptance Scenarios**:

1. **Given** a modal está aberta, **When** o usuário ativa o botão de fechar ou pressiona Escape, **Then** a modal é encerrada e o conteúdo da tabela volta ao foco utilizável.
2. **Given** a modal está aberta, **When** o usuário clica no backdrop fora do conteúdo, **Then** a modal fecha sem alterar filtros ou dados.
3. **Given** a tela está em largura móvel, **When** a modal abre, **Then** seu conteúdo permanece legível, com rolagem interna controlada e sem recorte das ações essenciais.

### Edge Cases

- A fonte de ícones não carregar: o botão deve manter texto acessível e não depender exclusivamente do glifo para operar.
- A modal receber foco em conteúdo que ultrapassa a altura da tela: permitir rolagem interna sem ocultar o botão de fechar.
- A preferência por movimento reduzido estiver ativa: não usar animação essencial ao funcionamento da modal.
- O tema claro ou escuro estiver ativo: a modal deve usar as superfícies e textos compatíveis com o tema atual.
- A comparação estiver incompleta ou desatualizada: não apresentar cálculo válido dentro da modal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A coluna de ações da tabela MUST substituir o texto visível `Detalhes` por um botão com ícone de Material.
- **FR-002**: O botão de detalhe MUST possuir rótulo acessível que permita identificar a ação e a skin correspondente.
- **FR-003**: Ao clicar no botão de uma linha válida, o sistema MUST abrir uma modal contendo a comparação existente dessa oportunidade.
- **FR-004**: A abertura da modal MUST NOT alterar a rota atual da aplicação.
- **FR-005**: Ao fechar a modal, o sistema MUST preservar filtros, ordenação, posição de navegação e tema ativos antes da abertura.
- **FR-006**: A modal MUST preservar a distinção Steam → CSFloat e CSFloat → Steam.
- **FR-007**: A modal MUST identificar crédito da carteira Steam como crédito não sacável, nunca como dinheiro disponível.
- **FR-008**: Linhas com estado incompleto, desatualizado ou não equivalente MUST NOT oferecer uma ação válida de detalhe.
- **FR-009**: A modal MUST ser fechável pelo controle explícito de fechar, por Escape e por clique no backdrop.
- **FR-010**: A modal MUST capturar o foco ao abrir, manter uma ordem de leitura lógica e devolver o foco ao botão de detalhe ao fechar.
- **FR-011**: A modal MUST manter superfícies, textos, bordas e estados legíveis nos temas claro e escuro.
- **FR-012**: Em larguras móveis, a modal MUST respeitar a área disponível, permitir rolagem interna e manter o fechamento acessível.
- **FR-013**: A abertura da modal MUST respeitar a preferência de movimento reduzido e não depender de animação para uso ou fechamento.
- **FR-014**: Os dados exibidos na modal MUST continuar sendo derivados dos cenários simulados já existentes, sem recalcular regras financeiras na apresentação.
- **FR-015**: Enquanto a modal estiver aberta, o sistema MUST aplicar uma camada escura semitransparente que reduza visualmente o destaque do conteúdo de fundo.

### Key Entities *(include if feature involves data)*

- **DetailAction**: ação visual associada a uma linha válida, contendo ícone, rótulo acessível e oportunidade alvo.
- **OpportunityDetailDialog**: modal temporária que apresenta a comparação de uma oportunidade sem alterar a rota da tabela.
- **DialogContext**: contexto mínimo necessário à modal, incluindo cenário, compra, venda e skin selecionada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das linhas válidas apresentam uma ação por ícone que abre a comparação sem navegar para outra tela.
- **SC-002**: Em um teste automatizado, os valores de pesquisa, direção, ordenação e tema definidos antes da abertura permanecem inalterados após fechar a modal.
- **SC-003**: 100% dos passos do fluxo de teclado definido no teste de aceitação (focar e abrir com Enter, navegar dentro da modal com Tab, fechar com Escape e recuperar o foco) são concluídos sem interação de ponteiro.
- **SC-004**: Em larguras de 320 px, 768 px e 1440 px, os limites da modal permanecem dentro da viewport; quando o conteúdo excede a altura disponível, ele pode ser rolado sem ocultar o botão de fechar.
- **SC-005**: O texto visível `Detalhes` deixa de aparecer na coluna de ações da tabela, enquanto a ação continua identificável por rótulo acessível.
- **SC-006**: Linhas inválidas não oferecem uma ação de detalhe válida e não apresentam cálculo disponível na modal.
- **SC-007**: A modal usa tema claro ou escuro do contexto ativo e mantém contraste legível em ambos.
- **SC-008**: Nenhum valor fictício ou crédito Steam é apresentado como dado real ou dinheiro sacável.
- **SC-009**: O backdrop da modal usa opacidade mínima de 0,5 e mantém o conteúdo de fundo visivelmente atenuado enquanto o diálogo está aberto.

## Assumptions

- O ícone padrão será um símbolo de visualização, como `visibility`, por ser claramente associado à abertura de detalhes.
- O clique no backdrop fecha a modal, além do botão e da tecla Escape.
- A página de detalhe atual pode continuar disponível em outras formas de navegação, mas não será acionada pela coluna de ações da tabela nesta feature.
- Filtros e ordenação são mantidos em memória durante a abertura da modal porque não ocorre troca de página.
- Dados simulados e fórmulas existentes continuam sendo a única fonte dos valores apresentados.
