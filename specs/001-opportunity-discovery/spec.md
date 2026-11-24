# Feature Specification: Descoberta de Oportunidades Simuladas

**Feature Branch**: `iniciando-mvp`

**Created**: 2026-11-21

**Status**: Approved

**Input**: User description: "Criar o primeiro fluxo do MVP para descobrir e comparar oportunidades simuladas de skins de CS2, com lista, comparação nas duas direções e filtros, sem dados reais de mercado."

## Clarifications

### Session 2026-11-21

- Q: Quando o resultado estimado for zero ou negativo, como esse cenário deve aparecer na lista principal? → A: Exibir junto com os resultados positivos, claramente identificado como não lucrativo.
- Q: Como você quer representar a liquidez no MVP e permitir filtrá-la? → A: Usar as categorias baixa, média e alta, atribuídas aos exemplos simulados considerando volume, frequência de vendas e spread; anúncios ativos são informação complementar.
- Q: Como taxas e custos entram no cálculo e quando ocorre o arredondamento? → A: Custos de aquisição são somados à compra; custos sobre os recebimentos são subtraídos da venda; cada valor é convertido para BRL antes da soma ou subtração, sem arredondar etapas intermediárias, e a apresentação usa duas casas decimais com arredondamento half-up.
- Q: Como comparar float e stickers na identidade dos itens? → A: Comparar float como valor decimal exato normalizado, sem tolerância; comparar stickers como conjunto sem ordem de pares nome/posição.
- Q: Qual desempenho faz parte deste MVP de dados simulados? → A: Atualizar a lista local em até 200 ms no percentil 95 para até 200 cenários, sem incluir latência de APIs externas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar cenários simulados (Priority: P1)

Como usuário, quero consultar cenários simulados de compra e venda para identificar possíveis oportunidades e entender quando uma comparação não apresenta resultado lucrativo.

**Why this priority**: A lista é a entrada principal para a experiência e deve apresentar os resultados sem ocultar comparações válidas que não sejam lucrativas.

**Independent Test**: Usar o conjunto de dados de exemplo e confirmar que comparações válidas aparecem com skin, direção da operação, estimativa de resultado, liquidez e identificação visível de que os dados são simulados e de quais resultados não são lucrativos.

**Acceptance Scenarios**:

1. **Given** existem oportunidades simuladas com dados suficientes e atuais, **When** o usuário abre a lista, **Then** cada oportunidade válida é exibida com nome e características da skin, marketplaces de origem e destino, moedas originais, direção, estimativa de resultado, margem, categoria de liquidez e horário da coleta simulada.
2. **Given** uma oportunidade contém preços ou condições simuladas com mais de 24 horas, **When** o usuário consulta a lista, **Then** ela é identificada como desatualizada e não é apresentada como oportunidade disponível.
3. **Given** nenhum registro atende aos critérios para ser uma oportunidade válida, **When** o usuário abre a lista, **Then** a interface informa que não há oportunidades disponíveis sem sugerir que houve uma falha de mercado real.
4. **Given** existem comparações válidas com resultados positivos, nulos e negativos, **When** o usuário abre a lista, **Then** todos são exibidos e os resultados nulos ou negativos são claramente identificados como não lucrativos.

### User Story 2 - Comparar os dois sentidos da operação (Priority: P2)

Como usuário, quero examinar a composição de uma oportunidade em cada sentido para entender os preços, custos e valores que formam a estimativa.

**Why this priority**: A lista aponta possibilidades, mas a comparação detalhada é necessária para compreender as premissas e distinguir dinheiro de créditos restritos a uma plataforma.

**Independent Test**: Selecionar uma skin com preços e taxas simulados completos e verificar separadamente os cenários Steam → CSFloat e CSFloat → Steam, incluindo os componentes de cálculo e a natureza do valor recebido.

**Acceptance Scenarios**:

1. **Given** uma skin equivalente tem dados simulados completos nos dois marketplaces, **When** o usuário abre a comparação, **Then** pode consultar cada sentido da operação separadamente, com preço original, moeda, conversão utilizada, custos, taxas, valor líquido estimado, resultado e margem.
2. **Given** o cenário termina com venda na Steam, **When** o resultado é apresentado, **Then** o valor recebido é identificado como saldo da carteira Steam, não sacável, e não é descrito como dinheiro disponível.
3. **Given** um dos sentidos não possui dados suficientes, **When** o usuário consulta a comparação, **Then** o sentido incompleto é identificado como indisponível sem ocultar o sentido oposto que tenha dados válidos.
4. **Given** taxas e custos tornam o resultado estimado nulo ou negativo, **When** o usuário consulta a comparação, **Then** o resultado é mostrado sem ser classificado como oportunidade lucrativa.
5. **Given** duas referências diferem em wear, StatTrak, Souvenir ou outro atributo de identidade presente nos dados, **When** o usuário consulta uma comparação, **Then** essas referências não são apresentadas como o mesmo item.
6. **Given** uma comparação possui todos os valores simulados necessários e conhecidos, **When** o resultado é calculado, **Then** o resultado líquido corresponde ao valor líquido recebido convertido para BRL menos o custo total de aquisição em BRL, e a margem corresponde ao resultado dividido pelo custo total de aquisição, multiplicado por 100, arredondados a duas casas decimais.
7. **Given** o usuário consulta uma oportunidade, **When** examina seus detalhes, **Then** não são oferecidas ações para comprar, vender, sacar ou conectar uma conta de marketplace.
8. **Given** duas referências têm floats numericamente iguais com representações decimais diferentes e os mesmos stickers/posições em ordens diferentes, **When** o usuário consulta a comparação, **Then** os itens são considerados equivalentes; diferenças no valor do float ou em qualquer par nome/posição impedem a equivalência.

### User Story 3 - Encontrar oportunidades por filtros (Priority: P3)

Como usuário, quero combinar filtros para reduzir a lista às oportunidades que correspondem aos meus critérios de preço, margem, liquidez e direção.

**Why this priority**: Os filtros tornam a lista mais útil para exploração, depois que a comparação básica estiver disponível.

**Independent Test**: Aplicar filtros conhecidos ao conjunto fixo de exemplo e verificar que todos os resultados atendem a cada condição selecionada e que limpar os filtros restaura a lista original.

**Acceptance Scenarios**:

1. **Given** a lista contém oportunidades de várias skins e faixas, **When** o usuário pesquisa parte do nome e define limites de custo de aquisição, margem e categoria mínima de liquidez, **Then** somente oportunidades que atendem a todos os critérios são exibidas.
2. **Given** o usuário seleciona um sentido de operação, **When** os filtros são aplicados, **Then** oportunidades do sentido oposto não aparecem nos resultados.
3. **Given** os filtros selecionados não correspondem a nenhuma oportunidade, **When** a lista é atualizada, **Then** a interface informa que nenhum resultado corresponde aos filtros e permite limpá-los.
4. **Given** há resultados após aplicar filtros, **When** o usuário escolhe ordenar por resultado estimado, margem ou liquidez, **Then** os resultados são ordenados dentro de cada sentido de operação e o tipo de valor recebido permanece visível.
5. **Given** o usuário define um custo mínimo maior que o custo máximo, **When** aplica os filtros, **Then** a interface informa que a faixa é inválida e não apresenta os resultados como filtrados.
6. **Given** o usuário define liquidez mínima como média, **When** aplica os filtros, **Then** somente oportunidades classificadas como média ou alta são exibidas.

### Edge Cases

- Um preço, taxa, cotação ou custo obrigatório está ausente, é inválido ou é zero: não calcular o resultado e identificar os dados insuficientes.
- As referências descrevem skins com diferenças em wear, StatTrak, Souvenir ou outras características de identidade presentes nos dados: não compará-las como o mesmo item.
- Float, Paint Seed, stickers ou atributos especiais estão disponíveis em apenas uma referência ou divergem entre referências: não considerar os itens equivalentes para essa comparação. Floats numericamente iguais com zeros finais diferentes são equivalentes; a ordem da lista de stickers não altera a equivalência, mas nome e posição precisam coincidir.
- Uma direção da operação tem dados desatualizados ou incompletos enquanto a outra tem dados válidos: avaliar e exibir cada direção independentemente.
- Os filtros eliminam todos os resultados: apresentar o estado sem resultados e permitir limpar os critérios.
- O usuário informa um limite mínimo maior que o máximo: informar que a faixa é inválida e não apresentar resultados como se o filtro tivesse sido aplicado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST apresentar somente dados de exemplo simulados nesta funcionalidade e MUST identificá-los visivelmente como não provenientes de atualização real de mercado.
- **FR-002**: O sistema MUST associar cada preço exibido à skin, ao marketplace de origem, à moeda original e ao horário da coleta simulada.
- **FR-003**: O sistema MUST comparar somente referências que representem itens equivalentes. A equivalência MUST considerar o nome de mercado, wear, StatTrak, Souvenir e atributos de identidade disponíveis. Floats presentes nas duas referências MUST ser comparados como valores decimais exatos após normalização numérica, sem tolerância; Paint Seed MUST coincidir como inteiro; stickers MUST ser comparados como conjunto sem ordem de pares `(name, slot)`; características especiais MUST coincidir por pares nome/valor. Atributo relevante ausente em uma das referências MUST impedir a equivalência.
- **FR-004**: O sistema MUST apresentar uma lista de comparações válidas com direção da operação, custo de aquisição, resultado estimado, margem, categoria de liquidez simulada (`baixa`, `média` ou `alta`) e estado de atualização. As categorias simuladas MUST considerar volume, frequência de vendas e spread; anúncios ativos MUST ser apenas informação complementar. Resultados positivos, nulos e negativos MUST ser exibidos; resultados nulos ou negativos MUST ser identificados como não lucrativos, não como oportunidades lucrativas.
- **FR-005**: O sistema MUST permitir examinar separadamente Steam → CSFloat e CSFloat → Steam para uma mesma skin equivalente quando houver dados suficientes.
- **FR-006**: Para uma comparação válida, o sistema MUST apresentar os preços originais e moedas, cada taxa/custo simulado com tipo e etapa de aplicação, a cotação utilizada, o custo total de aquisição, o valor líquido estimado recebido, o resultado estimado e a margem percentual. A moeda de referência dos valores comparáveis MUST ser BRL, mantendo também visíveis os valores e moedas originais.
- **FR-007**: Taxas `purchase` MUST compor o custo de aquisição; taxas `sale` e `withdrawal` MUST reduzir os recebimentos, sendo `withdrawal` aplicável somente quando o destino permitir saque; taxas `conversion` MUST indicar se incidem sobre aquisição ou recebimentos. Cada preço e taxa MUST ser convertido individualmente para BRL pela cotação simulada antes da soma ou subtração. O custo de aquisição MUST ser preço de compra em BRL mais taxas aplicáveis à aquisição; o valor líquido recebido MUST ser preço de venda em BRL menos taxas aplicáveis aos recebimentos; resultado líquido MUST ser valor líquido recebido menos custo de aquisição; margem MUST ser resultado dividido pelo custo de aquisição, multiplicado por 100. Cálculos MUST manter precisão decimal integral nas etapas intermediárias; somente valores apresentados MUST ser arredondados a duas casas decimais usando half-up. A apresentação MUST indicar os componentes usados no cálculo.
- **FR-008**: Quando o destino da venda for a Steam, o sistema MUST identificar o valor recebido como saldo não sacável da carteira Steam. Esse saldo MUST NOT ser descrito ou somado como dinheiro disponível para saque. Qualquer resultado ou margem desse sentido MUST ser identificado como variação nominal em saldo Steam, não como retorno em dinheiro.
- **FR-009**: O sistema MUST marcar como desatualizada uma referência cuja coleta simulada tenha ocorrido há mais de 24 horas em relação ao horário de referência do conjunto de dados. Referências desatualizadas MUST NOT sustentar uma oportunidade apresentada como disponível.
- **FR-010**: O sistema MUST permitir filtrar por nome da skin, custo de aquisição em BRL, margem mínima, categoria mínima de liquidez (`baixa`, `média` ou `alta`) e sentido da operação. As categorias de liquidez MUST seguir a ordem `baixa` < `média` < `alta`; selecionar uma categoria mínima MUST incluir essa categoria e as superiores. A busca por nome MUST ignorar diferenças entre maiúsculas e minúsculas; limites numéricos MUST incluir o valor de fronteira.
- **FR-011**: Quando múltiplos filtros forem selecionados, o sistema MUST exibir somente oportunidades que atendam a todos eles. O usuário MUST poder limpar todos os filtros.
- **FR-012**: O sistema MUST permitir ordenar resultados por resultado estimado, margem e categoria de liquidez dentro de cada sentido da operação. A ordenação por liquidez MUST seguir a ordem `baixa` < `média` < `alta`. Resultados com tipos diferentes de valor recebido MUST NOT ser ordenados em um único ranking de resultado estimado.
- **FR-013**: Quando faltarem dados necessários para identificar equivalência ou calcular um valor, o sistema MUST indicar a informação ausente e MUST NOT apresentar um cálculo como válido.
- **FR-014**: Quando não houver oportunidades ou resultados filtrados, o sistema MUST apresentar uma mensagem de estado vazio apropriada e uma ação para limpar os filtros, quando aplicável.
- **FR-015**: A funcionalidade MUST NOT realizar compras, vendas, saques ou conexões com contas de marketplace.
- **FR-016**: Os estados de dados and resultados MUST usar rótulos textuais explícitos e não depender exclusivamente de cor. O conjunto MUST distinguir `Dados simulados`, `Desatualizada`, `Incompleta` e `Não lucrativo`.
- **FR-017**: Todos os controles de busca, filtro, ordenação e comparação MUST ser operáveis por teclado, ter foco visível e preservar uma ordem de foco lógica. Estados de sucesso, alerta e erro MUST ser anunciáveis a tecnologias assistivas sem depender apenas de cor.
- **FR-018**: A interface MUST permanecer legível e utilizável em celular, tablet e desktop. Os estados de viewport MUST cobrir até `767 px` para celular, `768 px` até `1023 px` para tablet e `1024 px` ou mais para desktop, sem exigir rolagem horizontal.

### Key Entities *(include if feature involves data)*

- **Skin**: item comparado, identificado por nome de mercado e características relevantes como wear, StatTrak, Souvenir e, quando disponíveis, float, Paint Seed, stickers e atributos especiais.
- **Referência de preço**: preço simulado de uma skin em um marketplace, incluindo moeda original, custos e taxas aplicáveis, horário de coleta simulada e dados ilustrativos disponíveis de volume, frequência de vendas, spread e anúncios.
- **Cotação simulada**: relação de conversão usada para expressar valores comparáveis em BRL, com valor e horário de referência.
- **Oportunidade**: comparação de uma skin equivalente em um sentido de operação, com referências de compra e venda, custos, resultado estimado, margem, categoria de liquidez (`baixa`, `média` ou `alta`) e destino do valor recebido.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das referências e oportunidades exibidas identificam marketplace, moeda original, horário de coleta simulada e aviso de dado simulado.
- **SC-002**: O usuário consegue consultar os dois sentidos da operação separadamente para cada skin com dados suficientes.
- **SC-003**: Em 100% dos casos de exemplo com dados completos, resultado e margem exibidos correspondem às fórmulas documentadas sem arredondamento intermediário e com arredondamento half-up a duas casas decimais na apresentação.
- **SC-004**: Em todos os cenários de aceitação com venda na Steam, o usuário consegue identificar que o valor recebido é saldo não sacável, e não dinheiro disponível.
- **SC-005**: Em uma avaliação sem orientação além do enunciado “Encontre uma comparação com margem mínima de 3% e liquidez média ou alta”, pelo menos 4 de 5 participantes encontram uma comparação correspondente em até dois minutos usando os filtros.
- **SC-006**: Em 100% dos cenários de filtros combinados, cada resultado satisfaz todos os critérios ativos; limpar os filtros restaura a lista inicial.
- **SC-007**: Em 100% dos cenários válidos com resultado nulo ou negativo, a comparação permanece visível na lista e é identificada como não lucrativa.
- **SC-008**: 100% das oportunidades simuladas têm uma categoria de liquidez válida; filtros e ordenação respeitam a ordem baixa, média e alta.
- **SC-009**: Com até 200 cenários simulados e sem requisições de rede, a atualização visível da lista após alterar filtros ou ordenação ocorre em até 200 ms no percentil 95, medido em 30 execuções no Chromium do Playwright.

## Assumptions

- O usuário inicial é uma pessoa usando a aplicação sem conta ou perfil personalizado.
- A lista é abastecida por um conjunto pequeno e fixo de exemplos simulados, com dados suficientes para demonstrar resultados positivos, negativos, incompletos e desatualizados.
- O conjunto de demonstração e desempenho contém no máximo 100 identidades de skins e 200 cenários direcionais; o alvo de 200 ms não mede nem pressupõe latência de Steam, CSFloat ou qualquer API externa.
- O conjunto de fixtures inclui ao menos uma comparação com margem igual ou superior a 3% e liquidez média ou alta para a avaliação de SC-005.
- As categorias de liquidez são rótulos simulados atribuídos aos exemplos usando volume, frequência de vendas e spread como sinais; não representam uma pontuação ou classificação real de marketplace.
- A lista principal inclui todas as comparações válidas; somente resultados positivos são apresentados como oportunidades lucrativas.
- Valores originais permanecem visíveis na moeda do marketplace; BRL é a moeda usada para comparar custo de aquisição e resultado estimado.
- Taxas, custos e cotações necessários ao cálculo fazem parte dos dados simulados; esta funcionalidade não os obtém de fontes reais.
- Os filtros são combinados por interseção (AND); custo de aquisição é o valor total de compra convertido para BRL; limites de faixa são inclusivos.
- A ordenação por resultado estimado ocorre separadamente para cada sentido de operação, pois saldo Steam e dinheiro disponível não são valores intercambiáveis.
- Para esta funcionalidade, uma referência com mais de 24 horas em relação ao horário de referência do conjunto de dados é considerada desatualizada.
- A estimativa é informativa e não representa preço executável, lucro garantido ou recomendação financeira.
