# Guia passo a passo: MVP com GitHub Spec Kit

Este guia descreve como usar o Spec Kit para planejar e implementar o MVP de front-end do Best Trade CS2, conforme a [visão e missão do MVP](mvp-visao-missao.md).

O objetivo é praticar o ciclo de Spec-Driven Development em incrementos pequenos. Nesta fase, a aplicação usa dados mocados: não consulta marketplaces, não possui backend e não realiza operações financeiras.

## Antes de começar

Neste repositório, o Spec Kit está configurado para Copilot, na versão 1.4.3. As skills estão em `.github/skills/` e usam nomes com hífen, como `speckit-specify` e `speckit-plan`. No Copilot Chat, invoque ou selecione a skill correspondente pelo nome; a forma de invocação pode variar conforme a versão do VS Code.

A constituição em `.specify/memory/constitution.md` ainda contém o template sem preencher. Comece por ela.

## Ciclo de trabalho

### 1. Defina os princípios do projeto

Use a skill `speckit-constitution` para preencher `.specify/memory/constitution.md`.

Inclua princípios adequados ao MVP, por exemplo:

- Priorizar simplicidade e aprendizado incremental.
- Manter o MVP no front-end, sem backend ou integrações reais.
- Marcar dados, taxas, câmbio e resultados como simulados.
- Separar cálculos de apresentação e cobrir regras importantes com testes.
- Não apresentar estimativas como garantia de lucro ou recomendação financeira.
- Manter acessibilidade, responsividade e clareza da interface.

Revise o arquivo gerado e confirme que os princípios são específicos e úteis para tomar decisões, não apenas slogans.

### 2. Escolha uma funcionalidade pequena

Não especifique o MVP inteiro de uma vez. Comece por uma fatia vertical que entregue valor perceptível:

**Descoberta de oportunidades simuladas:** visualizar uma lista de oportunidades, comparar os dois sentidos de operação e filtrar os resultados.

Deixe autenticação, histórico real, persistência, integrações com Steam e CSFloat, câmbio ao vivo e gestão de inventário para etapas futuras.

### 3. Gere a especificação

Use `speckit-specify` com uma descrição do comportamento desejado. Por exemplo:

> Criar a experiência de descoberta de oportunidades simuladas para skins de CS2. O usuário deve consultar oportunidades em uma lista, comparar Steam → CSFloat e CSFloat → Steam, ver preços de compra e venda, taxas, lucro líquido estimado, margem, liquidez e horário fictício de atualização. Deve poder filtrar por nome, faixa de preço, margem mínima, liquidez mínima e tipo de operação. Todos os dados devem ser claramente identificados como simulados. Não incluir backend, APIs reais, autenticação ou operações financeiras.

A skill deve criar uma pasta de funcionalidade em `specs/`, com numeração sequencial, e o arquivo `spec.md`. Revise as histórias, requisitos, critérios de aceitação e cenários de exceção antes de avançar.

### 4. Esclareça as ambiguidades

Use `speckit-clarify` sobre a especificação recém-criada. Resolva, principalmente:

- Como são ordenadas as oportunidades e quais filtros podem ser combinados.
- O que significa uma oportunidade sem lucro ou com dados incompletos.
- Como a interface sinaliza dados simulados e desatualizados.
- Quais valores e taxas são exibidos no detalhe de cada comparação.
- O comportamento em telas pequenas e quando não há resultados.

Atualize ou aprove a especificação somente quando os critérios puderem ser testados sem interpretação subjetiva.

### 5. Planeje a solução técnica

Use `speckit-plan` e mantenha o plano restrito ao front-end. Considere as tecnologias já propostas no documento de visão do produto, mas evite introduzir componentes que o MVP não precisa.

O plano deve explicar, conforme necessário:

- Organização da tela e dos componentes.
- Modelo TypeScript para skin, preço, origem, horário de atualização e oportunidade.
- Serviço ou repositório de dados mocados, separado da interface.
- Cálculo de taxas e margem, com precisão adequada para valores monetários.
- Estados de carregamento, erro, dados incompletos e lista vazia.
- Testes para filtros, cálculos e estados da interface.

Não planeje endpoints, banco de dados, jobs de coleta ou adaptadores reais nesta fase.

### 6. Revise o plano

Leia o `plan.md` antes de gerar tarefas. Confirme que cada decisão técnica atende a um requisito da especificação e não expande o escopo.

Se houver divergência, corrija a especificação ou o plano e registre a decisão no artefato apropriado. Não deixe a implementação decidir silenciosamente regras de negócio.

### 7. Valide a qualidade dos requisitos

Use `speckit-checklist` para revisar clareza, completude, consistência e testabilidade da especificação. Resolva os itens pendentes antes de decompor o trabalho.

Depois, use `speckit-analyze` para procurar inconsistências entre constituição, especificação e plano. Trate conflitos encontrados antes da implementação.

### 8. Gere e revise as tarefas

Use `speckit-tasks` para criar `tasks.md`. As tarefas devem ser pequenas, ordenadas por dependência e verificáveis. Para esta funcionalidade, uma ordem possível é:

1. Definir os modelos e dados mocados.
2. Implementar a apresentação da lista de oportunidades.
3. Implementar os detalhes de comparação nos dois sentidos.
4. Implementar filtros e ordenação.
5. Implementar estados vazio, incompleto e desatualizado.
6. Adicionar ou completar testes dos cálculos e interações.
7. Validar responsividade e acessibilidade do fluxo.

Ajuste a lista ao plano gerado; não inclua tarefas de backend ou integração real.

### 9. Implemente em incrementos

Use `speckit-implement` para executar as tarefas na ordem definida. Depois de cada incremento, rode os testes e as verificações disponíveis no projeto. Compare o comportamento com os critérios de aceitação da especificação.

Se uma tarefa exigir uma decisão não registrada, pare e atualize primeiro a especificação ou o plano. Não aumente o escopo apenas para acomodar uma ideia surgida durante a implementação.

### 10. Faça a convergência

Use `speckit-converge` para comparar o resultado com a especificação, o plano e as tarefas. Transforme lacunas reais em tarefas adicionais, implemente-as e repita a validação.

Considere a funcionalidade concluída quando os critérios de aceitação estiverem atendidos, os testes relevantes passarem e a interface deixar claro que os dados são simulados.

## Próximas funcionalidades

Depois da descoberta de oportunidades, avance uma funcionalidade por ciclo. Uma sequência possível é:

1. Estrutura e navegação da aplicação.
2. Dashboard com indicadores simulados.
3. Comparador detalhado de marketplaces.
4. Filtros e pesquisa ampliados.
5. Histórico de preços demonstrativo.

Reavalie a ordem conforme o que aprender com cada incremento. Não implemente integrações reais até que essa mudança seja especificada como uma nova fase.

## Revisão final de cada ciclo

Antes de considerar um ciclo encerrado, confirme:

- O escopo implementado corresponde à especificação aprovada.
- Nenhuma integração ou fonte de dados real foi introduzida acidentalmente.
- Dados e resultados simulados estão identificados na interface.
- Casos sem resultado, incompletos e desatualizados têm comportamento definido.
- Os cálculos e filtros relevantes têm testes.
- A documentação foi atualizada quando decisões ou escopo mudaram.
