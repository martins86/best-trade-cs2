<!--
Sync Impact Report
Version change: unversioned template -> 1.0.0 (initial constitution)
Modified principles: none; this is the initial ratification
Added principles:
- Desenvolvimento orientado a especificações
- Transparência dos dados simulados
- Confiabilidade dos cálculos
- Qualidade verificável e acessibilidade
- Simplicidade e evolução gradual
Added sections:
- Restrições e escopo do MVP
- Fluxo de desenvolvimento
Removed sections: none
Follow-up TODO: confirm the formal ratification date
Remove this temporary report before committing the constitution.
-->

# Best Trade CS2 Constitution

## Core Principles

### I. Desenvolvimento orientado a especificações
Toda funcionalidade MUST ter uma especificação aprovada antes da implementação. O plano e as tarefas MUST permanecer consistentes com essa especificação, e mudanças de escopo MUST atualizar os artefatos antes de alterar o código. Isso mantém requisitos, decisões e implementação rastreáveis.

### II. Transparência dos dados simulados
Durante o MVP, preços, taxas, câmbio, volume, liquidez e horários fornecidos por dados mocados MUST ser identificados como simulados na interface. O produto MUST NOT apresentar esses valores como dados atuais de mercado, oportunidade executável ou garantia de lucro. Essa distinção evita induzir decisões financeiras com informações fictícias.

### III. Confiabilidade dos cálculos
Regras de taxas, conversão, lucro líquido e margem MUST ser explícitas e testáveis. Cálculos financeiros MUST evitar erros de ponto flutuante binário, usando representação decimal adequada ou unidades inteiras quando aplicável. A interface MUST permitir compreender os valores e premissas que compõem cada estimativa.

### IV. Qualidade verificável e acessibilidade
Critérios de aceitação MUST ser verificáveis. Cálculos e filtros críticos MUST ter testes automatizados; fluxos de interface MUST ser validados nos estados relevantes, incluindo dados vazios ou incompletos. A interface MUST ser responsiva, navegável por teclado e construída com práticas de acessibilidade compatíveis com os componentes utilizados.

### V. Simplicidade e evolução gradual
Cada incremento MUST implementar somente o escopo aprovado para sua funcionalidade. O MVP MUST permanecer no front-end com dados mocados: integrações reais, backend, persistência, autenticação e operações financeiras ficam fora do escopo até serem especificados como uma fase futura. Abstrações destinadas apenas à evolução futura MUST NOT ser introduzidas antes de serem necessárias ao comportamento atual ou justificadas no plano.

## Restrições e escopo do MVP

- O MVP valida a experiência de descoberta e comparação de oportunidades simuladas para skins de CS2.
- A aplicação não consulta Steam, CSFloat ou provedores de câmbio e não executa compras, vendas ou saques.
- A arquitetura de front-end proposta no documento de visão do produto é a referência inicial; decisões específicas de tecnologia e estrutura MUST ser justificadas no plano da funcionalidade.
- Saldo Steam MUST NOT ser descrito como dinheiro sacável. Qualquer cenário que mostre saldo ou conversão deve explicitar suas premissas.
- A visão de longo prazo não amplia automaticamente o escopo do MVP. Funcionalidades futuras exigem especificação e planejamento próprios.

## Fluxo de desenvolvimento

- Cada funcionalidade segue o fluxo Spec Kit: Specify, Clarify quando houver ambiguidades, Plan, Checklist, Tasks, Analyze, Implement e Converge.
- Antes de implementar, os responsáveis MUST revisar a especificação, o plano e as tarefas para confirmar escopo, dependências e critérios de aceitação.
- Tarefas MUST ser pequenas, ordenadas por dependência e associadas a uma forma de validação.
- Após cada incremento, os testes e verificações pertinentes MUST ser executados. Falhas e lacunas de requisitos MUST ser resolvidas antes de declarar a funcionalidade concluída.
- Decisões que alterem comportamento ou escopo MUST ser registradas nos artefatos Spec Kit correspondentes.

## Governance

Esta constituição orienta as decisões do projeto e prevalece quando houver conflito com práticas locais. Uma alteração de princípio ou restrição exige atualização desta constituição e revisão dos artefatos afetados. A conformidade MUST ser verificada durante Analyze, Converge e revisões de implementação.

Alterações desta constituição devem registrar sua justificativa e seguir versionamento semântico: MAJOR para remoção ou mudança incompatível de princípios; MINOR para novos princípios ou expansão material das regras; PATCH para esclarecimentos sem mudança semântica.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirmar a data formal de adoção | **Last Amended**: 2026-11-21
