# Best Trade CS2
## Documento de visão, requisitos e diretrizes para desenvolvimento com GitHub Spec Kit

**Versão:** 1.0  
**Data:** Novembro de 2026  
**Metodologia:** Spec-Driven Development (SDD)  
**Status:** Planejamento inicial

---

# 1. Visão do produto

## 1.1. Objetivo

Desenvolver uma aplicação web para monitoramento, comparação e análise do mercado de skins do Counter-Strike 2 (CS2), permitindo identificar oportunidades de arbitragem entre diferentes marketplaces, inicialmente Steam Community Market e CSFloat.

O sistema deverá comparar preços de aquisição e venda, considerando taxas, conversão monetária, liquidez, volume de negociações e características individuais dos itens.

O objetivo principal é fornecer informações que auxiliem na tomada de decisão para compra e venda de skins, identificando oportunidades potencialmente lucrativas.

Em etapas futuras, o sistema deverá evoluir para uma plataforma de gestão de operações financeiras, permitindo registrar compras, vendas, controlar inventário e acompanhar resultados históricos.

## 1.2. Objetivos específicos

- Comparar preços de skins entre Steam e CSFloat.
- Identificar oportunidades de arbitragem nas duas direções.
- Calcular lucro líquido estimado considerando taxas e conversões.
- Identificar skins com maior liquidez.
- Analisar volume e histórico de negociações.
- Disponibilizar filtros para identificação de oportunidades.
- Apresentar indicadores financeiros em um dashboard.
- Preparar a arquitetura para futura gestão de compras, vendas e inventário.

## 1.3. Público-alvo

Inicialmente, o sistema será desenvolvido para uso pessoal, com possibilidade de expansão futura para outros usuários.

---

# 2. Escopo do produto

## 2.1. MVP — Market Intelligence

O MVP deverá concentrar-se exclusivamente no monitoramento de mercado e identificação de oportunidades.

### Funcionalidades

**Dashboard**
- Quantidade de skins monitoradas.
- Quantidade de oportunidades identificadas.
- Margem média das oportunidades.
- Volume de negociações.
- Indicadores de liquidez.
- Melhores oportunidades disponíveis.

**Comparador de marketplaces**
- Comparação entre preços da Steam e CSFloat.
- Identificação da melhor plataforma para compra.
- Identificação da melhor plataforma para venda.
- Comparação nas duas direções.
- Exibição dos preços de referência e preços líquidos estimados.

**Análise de rentabilidade**
- Cálculo de taxas dos marketplaces.
- Conversão entre BRL e USD.
- Lucro líquido estimado.
- Margem percentual.
- Capital necessário para aquisição.
- Preço mínimo de venda para atingir determinada margem.

**Liquidez**
- Volume de vendas nas últimas 24 horas.
- Volume de vendas nos últimos 7 dias.
- Volume de vendas nos últimos 30 dias, quando disponível.
- Quantidade de anúncios ativos.
- Diferença entre preços de compra e venda.
- Indicador de liquidez por skin.

**Filtros**
- Nome da skin.
- Categoria.
- Faixa de preço.
- Marketplace.
- Margem mínima.
- Volume mínimo de negociações.
- Liquidez mínima.
- Tipo de operação.
- Float e desgaste, quando disponíveis.

## 2.2. Funcionalidades futuras

### Portfolio Management
- Registro manual de compras.
- Registro manual de vendas.
- Controle de inventário.
- Histórico de movimentações.
- Custo de aquisição por item.
- Controle de taxas e despesas.
- Integração com contas dos marketplaces, caso existam APIs e permissões adequadas.

### Financial Analytics
- Lucro realizado.
- Lucro não realizado.
- Rentabilidade acumulada.
- Evolução do capital.
- Resultado por marketplace.
- Resultado por skin.
- Relatórios mensais e anuais.
- Histórico completo de operações.

Essas funcionalidades não fazem parte do MVP, mas devem ser consideradas nas decisões arquiteturais e no modelo de dados.

---

# 3. Regras de negócio

## 3.1. Identificação dos itens

O sistema deverá identificar corretamente cada skin, evitando comparar itens que possuam características diferentes.

Os critérios de identificação deverão considerar, conforme disponibilidade:

- Nome de mercado (`market_hash_name`).
- Categoria do item.
- Exterior / Wear.
- Float.
- Paint Seed.
- Stickers.
- Características especiais.
- StatTrak.
- Souvenir.

Itens com características diferentes não deverão ser considerados equivalentes automaticamente.

## 3.2. Cálculo de arbitragem

O sistema deverá analisar duas modalidades:

**Operação A: Steam → CSFloat**

Comprar na Steam e vender no CSFloat.

**Operação B: CSFloat → Steam**

Comprar no CSFloat e vender na Steam.

O cálculo deverá considerar:

- Preço de aquisição.
- Taxa de compra, quando aplicável.
- Taxa de venda.
- Custos de conversão monetária.
- Custos de saque.
- Taxa de câmbio utilizada.
- Preço efetivo de venda.
- Margem de segurança.

Fórmula conceitual:

Lucro líquido = valor líquido recebido na venda - custo total de aquisição.

Margem percentual = (lucro líquido / custo total de aquisição) × 100.

Os valores deverão ser calculados utilizando precisão decimal adequada, evitando operações financeiras baseadas em ponto flutuante binário.

## 3.3. Separação de saldos

O sistema deverá diferenciar:

- Saldo financeiro disponível.
- Saldo da carteira Steam.
- Saldo disponível no CSFloat.
- Valores pendentes de saque.
- Valores investidos em skins.

Saldo Steam não deverá ser tratado como dinheiro sacável.

## 3.4. Indicador de liquidez

A liquidez deverá ser calculada a partir de informações disponíveis nos marketplaces.

O sistema deverá considerar:
- Volume de vendas.
- Quantidade de anúncios.
- Frequência de negociações.
- Spread entre preços.
- Histórico de movimentação.

A classificação de liquidez deverá ser configurável e não poderá depender exclusivamente da quantidade de anúncios ativos.

## 3.5. Qualidade dos dados

Toda informação de preço deverá possuir:
- Marketplace de origem.
- Data e hora da coleta.
- Moeda original.
- Preço original.
- Características do item.
- Identificação da fonte.
- Indicador de validade ou atualização.

O sistema deverá sinalizar dados desatualizados e evitar apresentar preços antigos como oportunidades disponíveis.

---

# 4. Arquitetura tecnológica

## 4.1. Frontend

**Angular 22.x + Angular Material 22.x**

Diretrizes:

- Utilizar a arquitetura Standalone Components.
- Organizar o projeto por funcionalidades (feature-based architecture).
- Utilizar Signals quando apropriado para gerenciamento de estado.
- Utilizar RxJS para fluxos assíncronos e integrações.
- Utilizar Reactive Forms.
- Implementar Lazy Loading.
- Separar componentes de apresentação e componentes de orquestração.
- Centralizar comunicação HTTP em serviços.
- Implementar tratamento global de erros.
- Implementar layouts responsivos.
- Priorizar acessibilidade.
- Utilizar Angular Material como biblioteca principal de componentes.
- Utilizar Apache ECharts para visualizações e gráficos.

Estrutura conceitual:

frontend/
- core/
  - authentication/
  - interceptors/
  - guards/
  - services/
- shared/
  - components/
  - pipes/
  - directives/
  - models/
- features/
  - dashboard/
  - market-comparison/
  - opportunities/
  - liquidity/
  - settings/
- layout/
  - shell/
  - navigation/
  - header/

## 4.2. Backend

**Java 25 + Spring Boot 4.1.x**

Diretrizes:

- Arquitetura modular por domínio.
- Exposição de APIs REST.
- Separação entre Controllers, Application Services e Domain.
- Utilização de DTOs.
- Validação de entradas.
- Tratamento padronizado de exceções.
- Spring Data JPA.
- Flyway para versionamento do banco.
- Spring Security para segurança.
- Spring Actuator para observabilidade.
- JUnit e Mockito para testes.
- Testcontainers para testes de integração.

Estrutura conceitual:

backend/
- config/
- shared/
- modules/
  - market/
  - marketplace/
  - comparison/
  - opportunity/
  - liquidity/
  - currency/
  - history/
  - portfolio/ (futuro)
  - transaction/ (futuro)

## 4.3. Banco de dados

**PostgreSQL**

O banco deverá armazenar:

- Catálogo de skins.
- Marketplaces.
- Anúncios e referências de preços.
- Histórico de preços.
- Histórico de câmbio.
- Configurações de taxas.
- Oportunidades identificadas.
- Dados necessários para futura gestão de operações.

Utilizar migrations para manter o esquema versionado.

## 4.4. Integrações externas

### Steam Community Market

Responsável por fornecer informações de preços, anúncios e histórico de mercado, conforme disponibilidade dos endpoints e permissões de acesso.

### CSFloat

Responsável por fornecer informações de anúncios, preços e características dos itens, utilizando APIs oficialmente disponíveis e respeitando limites e condições de utilização.

### Câmbio

O sistema deverá possuir uma camada independente para obtenção e armazenamento das taxas de conversão monetária.

As integrações externas deverão ser encapsuladas por adaptadores, evitando dependência direta das regras de negócio em relação aos provedores.

## 4.5. Processamento de dados

A coleta de preços deverá ocorrer por processos agendados no backend.

Diretrizes:

- Respeitar limites de requisições.
- Implementar controle de frequência.
- Implementar retry com backoff.
- Registrar falhas de integração.
- Evitar duplicidade de registros.
- Armazenar timestamps de coleta.
- Permitir configuração de frequência.
- Não depender de scraping agressivo.
- Diferenciar preço anunciado de preço efetivamente negociado.

---

# 5. Requisitos não funcionais

## 5.1. Segurança

- Validar todas as entradas.
- Não expor credenciais de APIs no frontend.
- Armazenar segredos em variáveis de ambiente ou gerenciador de segredos.
- Utilizar HTTPS.
- Implementar controles de acesso.
- Proteger endpoints administrativos.
- Registrar eventos relevantes.
- Evitar exposição de dados sensíveis.

## 5.2. Performance

- Utilizar paginação nas consultas.
- Evitar carregamento desnecessário de grandes volumes de dados.
- Implementar índices adequados.
- Utilizar cache quando houver benefício comprovado.
- Evitar consultas repetitivas aos marketplaces.
- Implementar processamento assíncrono para tarefas de coleta.

## 5.3. Qualidade

- Código modular e de fácil manutenção.
- Testes unitários.
- Testes de integração.
- Testes de contrato das integrações.
- Testes E2E para fluxos críticos.
- Análise estática de código.
- Revisão de segurança.
- Documentação das APIs.

## 5.4. Observabilidade

- Logs estruturados.
- Identificação de erros de integração.
- Monitoramento de tarefas agendadas.
- Indicadores de disponibilidade.
- Monitoramento de latência.
- Histórico de falhas de coleta.

---

# 6. Diretrizes de desenvolvimento com GitHub Spec Kit

O desenvolvimento deverá seguir o processo de Spec-Driven Development.

O Spec Kit será utilizado como ferramenta central de definição, planejamento, decomposição e validação das funcionalidades.

## 6.1. Princípios

1. Toda funcionalidade deverá possuir uma especificação antes da implementação.
2. Requisitos de negócio deverão ser independentes das decisões técnicas.
3. Decisões arquiteturais deverão estar documentadas.
4. Cada funcionalidade deverá possuir critérios de aceitação.
5. As tarefas deverão ser pequenas, rastreáveis e testáveis.
6. A implementação deverá respeitar os artefatos aprovados.
7. Alterações de escopo deverão atualizar as especificações.
8. Nenhuma implementação deverá ser considerada concluída sem validação dos requisitos.

## 6.2. Fluxo oficial de trabalho

### Etapa 1 — Constitution

Comando:

`/speckit.constitution`

Definir os princípios fundamentais do projeto:

- Arquitetura e organização.
- Qualidade de código.
- Segurança.
- Estratégia de testes.
- Padrões de desenvolvimento.
- Manutenibilidade.
- Performance.
- Documentação.

Resultado esperado: `constitution.md`.

### Etapa 2 — Specify

Comando:

`/speckit.specify`

Definir o comportamento esperado de cada funcionalidade.

A especificação deverá descrever:

- Objetivo.
- Problema que resolve.
- Usuários envolvidos.
- Histórias de usuário.
- Requisitos funcionais.
- Requisitos não funcionais.
- Critérios de aceitação.
- Regras de negócio.
- Cenários de exceção.

Resultado esperado: `spec.md`.

### Etapa 3 — Clarify

Comando:

`/speckit.clarify`

Identificar ambiguidades e pontos não definidos.

O agente deverá questionar especialmente:

- Regras de cálculo.
- Comportamento das integrações.
- Dados obrigatórios.
- Tratamento de erros.
- Critérios de liquidez.
- Cenários de indisponibilidade.
- Comportamento esperado da interface.

Resultado esperado: especificação refinada.

### Etapa 4 — Plan

Comando:

`/speckit.plan`

Definir a solução técnica.

O planejamento deverá considerar:

- Angular e Angular Material.
- Java e Spring Boot.
- PostgreSQL.
- Integrações externas.
- Arquitetura.
- Organização dos módulos.
- Modelagem de dados.
- Contratos de API.
- Estratégia de testes.
- Segurança.
- Infraestrutura.

Resultado esperado: `plan.md` e artefatos técnicos complementares.

### Etapa 5 — Checklist

Comando:

`/speckit.checklist`

Validar a qualidade dos requisitos.

Verificar se as especificações estão claras, completas, consistentes e testáveis.

### Etapa 6 — Tasks

Comando:

`/speckit.tasks`

Transformar o planejamento em tarefas executáveis.

As tarefas deverão ser:
- Pequenas.
- Independentes quando possível.
- Ordenadas por dependência.
- Associadas a critérios de conclusão.
- Organizadas por frontend, backend e infraestrutura quando aplicável.

Resultado esperado: `tasks.md`.

### Etapa 7 — Analyze

Comando:

`/speckit.analyze`

Verificar inconsistências entre:
- Constitution.
- Spec.
- Plan.
- Tasks.

Resolver conflitos antes de implementar.

### Etapa 8 — Implement

Comando:

`/speckit.implement`

Executar as tarefas respeitando a ordem definida.

A implementação deverá incluir:
- Código.
- Testes.
- Validações.
- Tratamento de erros.
- Documentação necessária.

### Etapa 9 — Converge

Comando:

`/speckit.converge`

Verificar se a implementação atende aos requisitos e aos artefatos definidos.

Caso existam lacunas, gerar tarefas complementares e repetir a validação.

---

# 7. Estratégia de decomposição das funcionalidades

O projeto deverá ser dividido em funcionalidades independentes, evitando uma única especificação excessivamente grande.

Sugestão inicial:

| Identificador | Funcionalidade |
|---|---|
| F001 | Estrutura inicial do projeto |
| F002 | Configurações e parâmetros do sistema |
| F003 | Integração com Steam Market |
| F004 | Integração com CSFloat |
| F005 | Catálogo e identificação de skins |
| F006 | Coleta e armazenamento de preços |
| F007 | Conversão monetária |
| F008 | Cálculo de taxas e rentabilidade |
| F009 | Comparador de marketplaces |
| F010 | Indicadores de liquidez |
| F011 | Identificação de oportunidades |
| F012 | Dashboard principal |
| F013 | Filtros e pesquisa |
| F014 | Histórico de preços |
| F015 | Gestão de compras e vendas (futuro) |
| F016 | Inventário de skins (futuro) |
| F017 | Relatórios financeiros (futuro) |

Cada funcionalidade deverá possuir seu próprio ciclo de especificação, planejamento, implementação e validação.

---

# 8. Estratégia de testes

## Frontend

- Testes unitários de componentes.
- Testes de serviços.
- Testes de formulários.
- Testes de estado.
- Testes de integração entre componentes.
- Testes E2E dos principais fluxos.

## Backend

- Testes unitários de regras de negócio.
- Testes de serviços.
- Testes de controllers.
- Testes de repositórios.
- Testes de integração com PostgreSQL.
- Testes de integração com provedores externos.
- Testes de segurança.
- Testes de cálculos financeiros.

## Cenários críticos

- Conversão de BRL para USD.
- Aplicação correta das taxas.
- Identificação de itens equivalentes.
- Preços desatualizados.
- Indisponibilidade de marketplaces.
- Dados incompletos.
- Anúncios removidos.
- Diferenças entre preço anunciado e preço de execução.
- Arredondamento financeiro.

---

# 9. Diretrizes para evolução futura

A arquitetura deverá permitir adicionar novos marketplaces sem reescrever as regras centrais de negócio.

A inclusão de novos provedores deverá ocorrer por adaptadores independentes.

A gestão financeira futura deverá utilizar registros imutáveis de movimentações, preservando o histórico de compras e vendas.

O sistema deverá separar:

- Lucro realizado.
- Lucro não realizado.
- Saldo em dinheiro.
- Saldo em marketplaces.
- Capital investido.
- Valor estimado do inventário.

Os cálculos históricos deverão preservar as taxas e cotações utilizadas na operação original, evitando alterações retroativas dos resultados.

---

# 10. Critérios de conclusão do MVP

O MVP será considerado concluído quando:

- [ ] As integrações de mercado estiverem funcionais.
- [ ] O sistema conseguir identificar e catalogar skins.
- [ ] Os preços forem armazenados com origem e timestamp.
- [ ] O comparador apresentar as duas direções de arbitragem.
- [ ] Os cálculos considerarem taxas e câmbio.
- [ ] O sistema apresentar indicadores de liquidez.
- [ ] O dashboard apresentar oportunidades ordenáveis.
- [ ] Os filtros estiverem funcionais.
- [ ] Os testes críticos estiverem aprovados.
- [ ] Os erros de integração estiverem tratados.
- [ ] A documentação técnica estiver atualizada.

---

# 11. Diretriz final

O CS2 Market Manager deverá ser desenvolvido como uma aplicação modular, escalável e orientada a domínio.

A prioridade inicial será construir uma ferramenta confiável de inteligência de mercado, capaz de identificar oportunidades reais de arbitragem.

O desenvolvimento deverá seguir rigorosamente o fluxo de Spec-Driven Development, utilizando o GitHub Spec Kit para manter alinhamento entre requisitos, arquitetura, tarefas e implementação.

A evolução para gestão financeira deverá ocorrer sem comprometer a estrutura inicial ou exigir uma reescrita significativa do sistema.
