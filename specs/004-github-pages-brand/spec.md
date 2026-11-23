# Feature Specification: Roteamento GitHub Pages e Marca

**Feature Branch**: `004-github-pages-brand`

**Created**: 2026-11-23

**Status**: Approved

**Input**: User description: "No GitHub Pages, corrigir o acesso direto a /opportunities para que não retorne 404 e iniciar o ajuste de marca de CS2 Market para Best Trade CS2."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abrir uma rota diretamente no GitHub Pages (Priority: P1)

Como visitante, quero acessar diretamente a URL publicada da página de oportunidades para visualizar a aplicação sem passar pela página inicial.

**Why this priority**: Links compartilhados e favoritos devem funcionar independentemente da primeira página acessada.

**Independent Test**: Abrir diretamente a URL publicada `/opportunities` em uma nova aba ou após atualizar o navegador e confirmar que a lista de oportunidades é exibida.

**Acceptance Scenarios**:

1. **Given** o visitante está em uma nova sessão, **When** acessa diretamente a URL publicada terminada em `/opportunities`, **Then** a aplicação mostra a página de oportunidades em vez de uma resposta 404.
2. **Given** o visitante está na página de oportunidades, **When** atualiza o navegador, **Then** a página de oportunidades continua sendo exibida.
3. **Given** o visitante navega a partir da página publicada, **When** entra em uma rota conhecida da aplicação, **Then** o endereço pode ser aberto diretamente ou atualizado sem perder o conteúdo correspondente.
4. **Given** o visitante tenta acessar uma rota desconhecida, **When** a aplicação responde, **Then** ele é conduzido à página de oportunidades conhecida em vez de permanecer em uma tela vazia ou de erro.

---

### User Story 2 - Reconhecer o nome correto da marca (Priority: P1)

Como visitante, quero identificar a aplicação pelo nome oficial "Best Trade CS2" para não confundir o produto com marcas ou nomes antigos.

**Why this priority**: Nome inconsistente reduz confiança e pode quebrar a identificação do produto em navegação e compartilhamento.

**Independent Test**: Abrir a aplicação e revisar cada identificação visível da marca, além do título exibido pelo navegador, para confirmar que não permanece "CS2 Market".

**Acceptance Scenarios**:

1. **Given** a aplicação está aberta, **When** o visitante consulta o cabeçalho da interface, **Then** a marca principal exibida é "Best Trade CS2".
2. **Given** o visitante consulta a aba ou a janela do navegador, **When** a página principal ou uma página interna está aberta, **Then** o título identifica a aplicação como "Best Trade CS2".
3. **Given** o visitante navega por páginas existentes, **When** a marca é apresentada mais de uma vez, **Then** todas as identificações visuais usam "Best Trade CS2" e nenhuma usa "CS2 Market".

### Edge Cases

- A URL publicada pode ser acessada com ou sem barra final no endereço da rota.
- O visitante pode atualizar a página em uma rota diretamente, e não apenas navegar dentro da aplicação.
- Links antigos ou nomes antigos podem existir em documentos externos: esta feature corrige a interface atual, não recria histórico nem redireciona marcas externas.
- A aplicação pode ser exibida em tema claro ou escuro: o nome da marca deve permanecer legível em ambos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O endereço público publicado MUST aceitar acesso direto à rota `/opportunities` e mostrar a página correspondente.
- **FR-002**: A atualização do navegador na rota `/opportunities` MUST manter a página de oportunidades visível.
- **FR-003**: O comportamento de acesso direto MUST preservar o prefixo público do projeto `/best-trade-cs2` sem direcionar o visitante para uma URL incorreta.
- **FR-004**: Rotas conhecidas da aplicação, incluindo oportunidades e seus detalhes existentes, MUST continuar acessíveis diretamente quando forem publicadas.
- **FR-005**: O endereço público MUST encaminhar uma rota desconhecida para a página de oportunidades conhecida.
- **FR-006**: O nome "Best Trade CS2" MUST substituir "CS2 Market" em todas as identificações visíveis da marca na aplicação.
- **FR-007**: A marca exibida no cabeçalho ou área equivalente MUST usar exatamente "Best Trade CS2".
- **FR-008**: O título da página no navegador MUST identificar a aplicação como "Best Trade CS2".
- **FR-009**: Nenhuma interface principal ou página interna publicada MUST apresentar "CS2 Market" como nome da marca.
- **FR-010**: O ajuste da marca MUST manter os rótulos funcionais já existentes, como "Oportunidades", "Mercado" e "Dados demonstrativos".
- **FR-011**: O ajuste de marca MUST NOT alterar dados simulados, cálculos, filtros, navegação funcional ou tema.

### Key Entities *(include if feature involves data)*

- **PublicApplicationRoute**: endereço publicado acessível diretamente pelo visitante e correspondente a uma tela conhecida.
- **BrandIdentity**: nome oficial apresentado ao usuário em área de marca e título da página.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste manual ou automatizado, `https://martins86.github.io/best-trade-cs2/opportunities` abre a página de oportunidades em uma nova sessão.
- **SC-002**: Após atualizar o navegador em `/opportunities`, a página permanece acessível sem resposta 404.
- **SC-003**: Links diretos das rotas conhecidas abertas em navegador novo são resolvidos para a tela correspondente.
- **SC-004**: Rotas desconhecidas deixam de resultar em tela vazia e são encaminhadas para `/opportunities`.
- **SC-005**: O texto "CS2 Market" deixa de aparecer nas áreas visíveis da aplicação após o ajuste.
- **SC-006**: O texto "Best Trade CS2" aparece como nome principal da marca e no título da página em 100% das páginas principais testadas.
- **SC-007**: O ajuste não altera os cenários simulados, resultados de filtros, cálculos existentes ou disponibilidade dos recursos do tema.

## Assumptions

- O acesso público continua sendo feito pelo GitHub Pages no domínio `martins86.github.io`, dentro do prefixo `/best-trade-cs2`.
- O usuário deve poder abrir diretamente também rotas internas já conhecidas pela aplicação.
- "Iniciar o ajuste de marca" significa atualizar a identidade oficial visível na interface atual, incluindo nome da aplicação no cabeçalho e título do navegador.
- Dados simulados e regras financeiras existentes permanecem fora do escopo desta feature.
