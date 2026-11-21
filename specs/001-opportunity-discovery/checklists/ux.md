# UX and Data Requirements Checklist: Descoberta de Oportunidades Simuladas

**Purpose**: Revisar clareza, completude, consistência e cobertura dos requisitos de UX e apresentação dos dados financeiros.  
**Created**: 2026-11-21  
**Feature**: [spec.md](../spec.md)

**Note**: Esta checklist customizada foi gerada a partir do contexto da feature e dos requisitos existentes.
**Review Ownership**: Esta checklist é um artefato de revisão de qualidade dos requisitos, sob responsabilidade do reviewer. Marque um item `[x]` somente quando o critério de qualidade do requisito tiver sido revisado e satisfeito.
**Marker Semantics**: `[x]` significa que o requisito foi considerado claro e suficiente; não significa que a implementação esteja concluída.

## Completude dos requisitos

- [ ] CHK001 - Os campos exigidos para cada comparação na lista estão especificados de forma completa, incluindo origem, moeda, atualização, direção, resultado, margem e liquidez? [Completeness, Spec §FR-002, FR-004]
- [ ] CHK002 - Os requisitos identificam todos os custos e valores necessários para explicar o cálculo em cada direção, incluindo taxas, conversão e valor líquido recebido? [Completeness, Spec §FR-006, FR-007]
- [ ] CHK003 - Os requisitos definem como referências desatualizadas podem ser consultadas sem serem confundidas com oportunidades disponíveis? [Coverage, Spec §FR-009, User Story 1]

## Clareza dos requisitos

- [ ] CHK004 - Os rótulos e a distinção visual necessários para dados simulados, dados desatualizados e resultados não lucrativos estão definidos sem depender de termos subjetivos como “visível” ou “claramente”? [Clarity, Spec §FR-001, FR-004, FR-009]
- [ ] CHK005 - A regra de 24 horas especifica uma única referência temporal para decidir se os dados estão desatualizados? [Clarity, Spec §FR-009, Assumptions]
- [ ] CHK006 - O significado de custo de aquisição, resultado líquido, margem e variação nominal em saldo Steam está distinguido para que os termos não sejam interpretados como valores equivalentes? [Clarity, Spec §FR-006–FR-008]

## Consistência dos requisitos

- [ ] CHK007 - A terminologia distingue consistentemente uma comparação válida de uma oportunidade lucrativa, já que cenários com resultado nulo ou negativo também permanecem na lista? [Consistency, Spec §User Story 1, FR-004, SC-007]
- [ ] CHK008 - A regra de não tratar saldo Steam como dinheiro está consistente entre cálculo, rótulos de margem e ordenação dos resultados? [Consistency, Spec §FR-008, FR-012, SC-004]
- [ ] CHK009 - As categorias de liquidez, sua ordem, seus sinais de origem e o comportamento do filtro mínimo estão descritos de modo consistente? [Consistency, Spec §FR-004, FR-010, FR-012, SC-008]

## Qualidade dos critérios de aceitação

- [ ] CHK010 - Os critérios de sucesso descrevem como avaliar objetivamente a consulta aos dois sentidos, além de afirmar que ambos estão disponíveis? [Measurability, Spec §SC-002]
- [ ] CHK011 - Os critérios financeiros especificam a precisão exibida e o tratamento de arredondamento de forma consistente para resultado e margem? [Measurability, Spec §FR-007, SC-003]

## Cobertura de cenários e casos extremos

- [ ] CHK012 - As regras de equivalência definem como comparar atributos opcionais, inclusive tolerância ou normalização para float e ordenação de stickers? [Edge Case, Spec §FR-003, Edge Cases]
- [ ] CHK013 - Os requisitos cobrem dados ausentes, inválidos ou zero e deixam claro quais partes da comparação ainda podem ser apresentadas sem um cálculo válido? [Coverage, Spec §FR-013, Edge Cases]
- [ ] CHK014 - Os requisitos definem o comportamento da faixa de custo inválida e de filtros combinados sem resultados, incluindo como o usuário identifica e corrige a condição? [Coverage, Spec §FR-010, FR-011, FR-014]

## Requisitos não funcionais

- [ ] CHK015 - Os requisitos da feature especificam como acessibilidade por teclado, foco, rótulos e distinção que não dependa apenas de cor se aplicam aos filtros e resultados? [Coverage, Constitution §IV, Plan §Technical Context]
- [ ] CHK016 - Os requisitos determinam quais larguras de tela e critérios de legibilidade são necessários para a lista e a comparação? [Gap, Constitution §IV, Plan §Technical Context]

## Dependências e premissas

- [ ] CHK017 - Os requisitos deixam claro que as categorias de liquidez são rótulos simulados e documentam como os dados de exemplo justificam cada categoria, sem sugerir uma classificação de mercado real? [Assumption, Spec §FR-004, Clarifications]
- [ ] CHK018 - As premissas sobre conjunto fixo de dados, usuário sem perfil e ausência de serviços externos são suficientes para delimitar o que esta feature deve especificar? [Completeness, Spec §Assumptions, FR-001, FR-015]

## Notes

- Todos os itens estão inicialmente desmarcados; a marcação é responsabilidade do reviewer.
- Estes itens avaliam a escrita e a cobertura dos requisitos, não a execução de testes nem a conformidade do código.
- `checklists/requirements.md` é a checklist de qualidade base mantida por `/speckit-specify` e `/speckit-clarify`; esta checklist customizada tem ciclo de revisão independente.
- Itens sobre precisão visual, normalização de atributos e sinais de liquidez podem motivar refinamentos da spec se o reviewer os considerar relevantes antes do planejamento de tarefas.
