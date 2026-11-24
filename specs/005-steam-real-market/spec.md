# Feature Specification: Dados reais da Steam no front-end

**Feature Branch**: `005-steam-real-market`

**Created**: 2026-11-24

**Status**: Approved

**Input**: User description: "Vamos seguir com o front-end consumindo informações reais do mercado da Steam, listando de 20 em 20 itens mais comercializados e no menor preço encontrado. Vamos listar dados reais da Steam primeiro, depois consumimos do CSFloat e cruzamos os dados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar itens reais mais comercializados da Steam (Priority: P1)

Como usuário, quero consultar uma lista paginada de skins reais do CS2 disponíveis no mercado da Steam, para acompanhar os itens com maior atividade comercial e o menor preço anunciado.

**Why this priority**: Esta é a primeira integração real do produto e estabelece o fluxo mínimo com dados atuais do mercado.

**Independent Test**: Abrir a aplicação sem usar fixtures e confirmar que a primeira página apresenta até 20 itens reais, ordenados pelos itens mais comercializados, com nome, menor preço e indicação da origem Steam.

**Acceptance Scenarios**:

1. **Given** a Steam está disponível, **When** o usuário abre a página de mercado, **Then** o sistema apresenta até 20 itens reais de CS2 ordenados pelos mais comercializados.
2. **Given** uma página foi carregada, **When** o usuário solicita a próxima página, **Then** o sistema apresenta os próximos até 20 itens sem repetir itens já exibidos.
3. **Given** um item tem vários anúncios ou valores de venda disponíveis, **When** o sistema monta o resultado, **Then** apresenta o menor preço encontrado como referência principal.
4. **Given** os dados exibidos vêm da Steam, **When** o usuário consulta um item, **Then** o mercado de origem, a moeda, o horário da consulta e o status da disponibilidade são identificados.

---

### User Story 2 - Consultar dados com falhas ou indisponibilidade da Steam (Priority: P2)

Como usuário, quero receber uma mensagem útil quando os dados da Steam não puderem ser obtidos, para distinguir indisponibilidade temporária de dados inválidos ou inexistentes.

**Why this priority**: APIs externas são variáveis e a interface não deve parecer que encontrou resultados reais quando a consulta falhou.

**Independent Test**: Simular indisponibilidade ou resposta inválida da Steam e confirmar que a aplicação informa o erro, permite tentar novamente e não mistura esses resultados com dados fictícios.

**Acceptance Scenarios**:

1. **Given** a consulta à Steam falha, **When** o usuário abre a página, **Then** o sistema informa que os dados reais não puderam ser carregados e oferece uma nova tentativa.
2. **Given** a Steam responde sem itens para uma página, **When** o usuário navega além do fim da coleção, **Then** o sistema informa que não existem mais itens e não cria uma página vazia falsa.
3. **Given** um item não possui preço válido, **When** o sistema processa o resultado, **Then** o item não é apresentado como tendo um menor preço confirmado.

---

### User Story 3 - Reduzir consultas repetidas com cache em memória (Priority: P3)

Como usuário, quero que páginas já consultadas sejam reutilizadas durante a sessão atual, para navegar rapidamente sem repetir integrações desnecessárias.

**Why this priority**: Cache em memória atende o MVP sem banco de dados e reduz pressão sobre a API externa.

**Independent Test**: Abrir uma página, voltar e revisitar a mesma página durante a sessão e confirmar que a segunda visita reutiliza o conteúdo armazenado em memória.

**Acceptance Scenarios**:

1. **Given** uma página já foi consultada nesta sessão, **When** o usuário a revisita sem recarregar a aplicação, **Then** o sistema reutiliza os dados em memória.
2. **Given** o usuário atualiza os dados manualmente ou o cache expira, **When** a consulta é realizada novamente, **Then** o sistema busca uma versão atualizada da Steam.
3. **Given** a aplicação é recarregada, **When** uma nova sessão começa, **Then** o cache anterior não é reutilizado.

## Edge Cases

- A Steam responde lentamente ou excede o limite de requisições: informar carregamento ou indisponibilidade temporária sem mostrar dados antigos como atuais.
- A Steam muda o nome, a moeda ou a estrutura do item: apresentar o valor apenas quando os campos essenciais forem válidos.
- Uma página contém menos de 20 itens válidos: completar a lista apenas com itens válidos disponíveis, sem preencher com dados fictícios.
- Itens Steam e CSFloat possuem nomes semelhantes, mas características diferentes: não assumir correspondência antes de uma identidade normalizada explícita.
- O usuário navega rapidamente entre páginas: evitar atualizar a interface com respostas antigas fora de ordem.
- O usuário limpa ou atualiza o cache em memória: a próxima consulta busca dados reais novamente.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST consultar o catálogo de skins de CS2 disponíveis no mercado da Steam e apresentar somente dados reais dessa fonte nesta etapa.
- **FR-002**: A listagem MUST apresentar até 20 itens por página.
- **FR-003**: Os itens MUST ser ordenados pelos mais comercializados, com base no sinal disponível da Steam para popularidade ou volume recente.
- **FR-004**: Para cada item, o sistema MUST identificar o menor preço anunciado encontrado na Steam.
- **FR-005**: Cada item exibido MUST informar nome, mercado de origem, moeda original, menor preço, estado da consulta e horário da coleta.
- **FR-006**: O sistema MUST permitir avançar e voltar entre páginas reais sem repetir itens dentro da coleção consultada.
- **FR-007**: O sistema MUST manter cache somente em memória durante a sessão da aplicação.
- **FR-008**: Ao recarregar a aplicação, o sistema MUST iniciar sem dados do cache anterior.
- **FR-009**: O sistema MUST informar claramente erros de disponibilidade da Steam e permitir nova tentativa.
- **FR-010**: O sistema MUST distinguir dados reais de dados simulados e não reutilizar fixtures desta feature como resultado real.
- **FR-011**: A interface MUST impedir apresentação de preço ou popularidade quando os campos necessários forem ausentes ou inválidos.
- **FR-012**: A navegação paginada MUST invalidar respostas antigas quando uma nova consulta for iniciada.
- **FR-013**: Os dados da Steam MUST NOT ser apresentados como oportunidade executável, garantia de lucro ou recomendação financeira.
- **FR-014**: O sistema MUST NÃO executar compras, vendas, saques, autenticação Steam ou conexão de conta nesta etapa.
- **FR-015**: A integração com CSFloat MUST permanecer fora desta primeira entrega real da Steam.
- **FR-016**: Registro de compras, vendas, inventário, saldo da conta Steam e lucro realizado MUST permanecer fora desta entrega.
- **FR-017**: O front-end MUST acessar a Steam por uma origem aprovada para navegador, preferencialmente um gateway de borda com CORS controlado. A aplicação MUST NOT exigir credenciais Steam ou chaves de API no código do navegador.
- **FR-018**: Antes da publicação, o mecanismo de acesso aprovado MUST definir URL, política de origem permitida, timeout e comportamento de tentativa em caso de limite de requisições.

### Key Entities *(include if feature involves data)*

- **Item Steam real**: skin de CS2 identificada pelo nome de mercado e os dados efetivamente retornados pela Steam.
- **Preço Steam**: menor anúncio encontrado para um item, com valor, moeda e horário da consulta.
- **Página de itens**: coleção ordenada de até 20 itens Steam com cursor ou deslocamento correspondente à navegação.
- **Resultado da consulta**: estado da resposta contendo sucesso, falha, horário, origem e itens válidos.
- **Entrada de cache**: dados Steam armazenados apenas na memória da sessão, com associação à página e à validade temporal.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das consultas bem-sucedidas, cada página contém no máximo 20 itens reais da Steam.
- **SC-002**: 100% dos itens exibidos identificam origem Steam e horário da consulta.
- **SC-003**: Para 100% dos itens com preço válido, o valor exibido corresponde ao menor preço retornado pela consulta da Steam.
- **SC-004**: A navegação entre páginas não repete itens já exibidos em uma sequência válida de resultados.
- **SC-005**: Uma página revisitada durante a mesma sessão é exibida novamente em menos de 200 ms em 95% das vezes por cache em memória.
- **SC-006**: Após recarregar a aplicação, nenhuma informação de mercado da sessão anterior permanece visível.
- **SC-007**: Em 100% das falhas da Steam, a interface apresenta estado de erro e ação de nova tentativa, sem dados fictícios misturados.
- **SC-008**: Nenhuma ação de compra, venda, saque, conexão com conta ou registro financeiro está disponível nesta feature.

## Assumptions

- A Steam disponibiliza dados públicos suficientes para listar itens de CS2 e consultar seus menores preços anunciados dentro dos limites aplicáveis.
- Os itens são considerados reais enquanto puderem ser rastreados a uma resposta atual da Steam.
- A moeda exibida é a informada pela consulta real da Steam; no MVP não haverá conversão ou persistência monetária.
- Popularidade ou comercialização é definida pelo sinal mais próximo disponível na consulta da Steam, sem inventar uma métrica própria.
- O cache em memória expira ou permite atualização manual em intervalos definidos no planejamento técnico.
- A integração direta a partir do navegador pode depender de acesso público ou proxy HTTP aprovado, mas não exige backend próprio persistente.
- Dados do CSFloat, histórico persistido, transações financeiras, inventário Steam e autenticação ficam fora desta feature.
