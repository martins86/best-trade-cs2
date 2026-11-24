# Best Trade CS2

Aplicação web para explorar e comparar cenários simulados de compra e venda de skins de **Counter-Strike 2** entre a Steam Community Market e a CSFloat.

> **Estado atual:** este repositório contém um MVP de frontend com dados locais fictícios. Não há integrações com marketplaces, backend, banco de dados, autenticação ou operações financeiras reais.

## Visão do projeto

O objetivo do MVP é validar uma experiência clara para:

- descobrir oportunidades simuladas;
- comparar os sentidos Steam → CSFloat e CSFloat → Steam;
- visualizar custos, taxas, conversões, resultado líquido e margem;
- filtrar cenários por skin, preço, margem, liquidez e direção;
- distinguir resultados positivos de resultados nulos ou negativos;
- identificar dados desatualizados ou incompletos;
- separar dinheiro disponível de crédito não sacável da carteira Steam.

Os valores são informativos e não representam preços executáveis, lucro garantido ou recomendação financeira.

## Funcionalidades implementadas

- Lista responsiva de oportunidades simuladas.
- Indicadores de cenários disponíveis, resultados lucrativos, margem média e alta liquidez.
- Filtros combinados por nome, direção, liquidez mínima, margem mínima e faixa de custo.
- Ordenação por liquidez, margem ou resultado.
- Comparação detalhada das duas direções de operação.
- Modal de detalhes sem alteração da rota ou perda dos filtros.
- Cálculos financeiros com precisão decimal usando `decimal.js`.
- Conversão para BRL e arredondamento half-up na apresentação.
- Identificação de liquidez baixa, média ou alta.
- Estados para resultados desatualizados, incompletos e sem correspondência.
- Temas claro e escuro, com preferência persistida.
- Layout responsivo para desktop, tablet e celular.
- Páginas de oportunidades carregadas sob demanda por rota para reduzir o bundle inicial.
- Dados locais em fixtures, sem chamadas a APIs externas.

## Tecnologias

### Frontend atual

- Angular 22
- Angular Material 22
- Angular CDK
- TypeScript 6
- RxJS
- SCSS
- Decimal.js
- Vitest
- Playwright

### Planejamento arquitetural futuro

Os documentos de visão também descrevem uma evolução para uma arquitetura com Java/Spring Boot, PostgreSQL e integrações oficiais com Steam e CSFloat. Essas tecnologias e integrações **ainda não estão implementadas** neste workspace.

## Estrutura do repositório

```text
.
├── frontend/                    # Aplicação Angular standalone
│   ├── src/app/
│   │   ├── core/                # Serviços compartilhados, como tema
│   │   ├── features/
│   │   │   └── opportunities/   # Domínio, dados mock e interface de oportunidades
│   │   └── shared/              # Layout e componentes compartilhados
│   ├── e2e/                     # Cenários end-to-end Playwright
│   └── package.json
├── specs/                       # Especificações, planos e tarefas das features
├── .specify/                    # Configuração e templates do Spec Kit
├── docs/                        # Visão, missão e documentação do projeto
└── README.md
```

No módulo de oportunidades, os principais conceitos são separados em:

- `domain/`: entidades, equivalência de itens, filtros e cálculos;
- `data/`: repositório local e fixtures simulados;
- `pages/`: lista e página de detalhes;
- `ui/`: tabela, indicadores, comparação e modal.

## Pré-requisitos

- Node.js compatível com Angular 22;
- npm;
- navegador moderno para executar a interface e os testes E2E.

O arquivo [frontend/package.json](frontend/package.json) define o gerenciador de pacotes como npm.

## Como executar

Entre na pasta do frontend e instale as dependências:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Por padrão, a aplicação ficará disponível em `http://localhost:4200/`.

Para gerar o build de produção:

```bash
npm run build
```

Os artefatos serão gerados pelo Angular no diretório `dist/`.

## Testes

### Testes unitários

```bash
cd frontend
npm test
```

O projeto usa Vitest por meio do builder do Angular. A execução exige cobertura global mínima de 95% em statements, branches, functions e lines; o comando falha quando qualquer métrica fica abaixo do limite. O mesmo comando é executado pelo job de testes unitários do CI.

### Testes end-to-end

```bash
cd frontend
npm run e2e
```

Os testes Playwright estão em [frontend/e2e](frontend/e2e/) e cobrem navegação, layout, temas, modal, filtros e regressões de desempenho.

## Scripts disponíveis

Execute todos os scripts a partir de `frontend/`:

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento Angular |
| `npm run build` | Compila a aplicação |
| `npm run watch` | Compila em modo watch |
| `npm test` | Executa testes unitários uma vez |
| `npm run test:watch` | Executa testes unitários em modo watch |
| `npm run e2e` | Executa os testes Playwright |

## Dados e cálculos

Os dados são fornecidos por [frontend/src/app/features/opportunities/data](frontend/src/app/features/opportunities/data/) e incluem:

- skins e suas características;
- referências de preço da Steam e CSFloat;
- taxas simuladas;
- cotação fictícia USD → BRL;
- cenários válidos, incompletos e desatualizados.

As regras financeiras do MVP consideram:

- taxas de compra no custo de aquisição;
- taxas de venda e saque no valor recebido;
- conversão individual de preços e custos para BRL;
- resultado líquido como recebimento líquido menos custo de aquisição;
- margem como resultado líquido dividido pelo custo de aquisição;
- precisão decimal integral nas etapas intermediárias;
- apresentação com duas casas decimais e arredondamento half-up.

Na direção CSFloat → Steam, o resultado representa **crédito da carteira Steam**, não dinheiro sacável.

## Limitações do MVP

Atualmente, a aplicação não:

- consulta APIs reais;
- executa compras, vendas ou saques;
- conecta contas de marketplaces;
- realiza autenticação;
- persiste dados em backend ou banco;
- apresenta preços como dados atualizados do mercado;
- calcula resultados financeiros realizados;
- gerencia inventário ou histórico de operações.

## Desenvolvimento orientado por especificação

O projeto utiliza GitHub Spec Kit. As funcionalidades são documentadas em `specs/<identificador>-<nome>/`, com artefatos como:

- `spec.md`: requisitos e critérios de aceitação;
- `plan.md`: plano técnico;
- `data-model.md`: modelo de dados;
- `tasks.md`: tarefas da implementação;
- `checklists/`: verificações de qualidade.

Os documentos principais estão em [docs](docs/):

- [Visão e missão do MVP](docs/mvp-visao-missao.md)
- [Documento de visão e requisitos](docs/best-trade-cs2.md)
- [Guia do MVP com Spec Kit](docs/guia-mvp-spec-kit.md)
- [Instalação do Spec Kit](docs/install-spec-kit.md)
