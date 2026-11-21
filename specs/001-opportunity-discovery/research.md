# Pesquisa e decisões: Descoberta de Oportunidades Simuladas

**Data**: 2026-11-21  
**Escopo**: decisões técnicas necessárias para planejar a feature descrita em [spec.md](spec.md).

## Aplicação e estrutura

**Decisão**: Uma SPA em Angular 22.x, com componentes standalone e organização por feature em `frontend/`. Usar Angular Material 22.x para controles e componentes comuns. Usar Signals para estado local da tela; RxJS só será necessário se um fluxo assíncrono for introduzido posteriormente.

**Rationale**: Essa escolha segue a arquitetura frontend prevista nos documentos do produto e mantém o MVP em um único projeto sem adicionar backend.

**Alternativas consideradas**: Criar frontend e backend em conjunto ou usar outra biblioteca de interface. Rejeitadas porque esta etapa é estritamente front-end com dados locais e a stack Angular já está definida como referência do projeto.

## Origem e organização dos dados

**Decisão**: Manter fixtures TypeScript estáticas em `features/opportunities/data/`. Um serviço local fornece as referências de preço, cotações e indicadores; o domínio deriva as comparações e não mantém resultados calculados duplicados nas fixtures.

**Rationale**: Dados locais satisfazem o escopo sem APIs, armazenamento ou simuladores de rede, e permitem testar cenários determinísticos.

**Alternativas consideradas**: JSON servido por backend, armazenamento local no navegador ou mocks de API. Rejeitadas porque introduziriam infraestrutura e comportamentos que a spec exclui.

## Cálculos financeiros

**Decisão**: Usar Decimal.js para taxas, conversão, custo, resultado e margem. Valores monetários e taxas entram nas fixtures como strings decimais; arredondar os valores apresentados para duas casas decimais segundo a spec.

**Rationale**: A constituição exige evitar erros de ponto flutuante binário. Uma biblioteca decimal mantém a regra explícita e testável sem implementar aritmética financeira própria.

**Alternativas consideradas**: `number` do JavaScript ou aritmética de ponto fixo feita manualmente. `number` não atende à constituição; a implementação manual aumenta o risco de erros de precisão e arredondamento.

## Aplicação de taxas e arredondamento

**Decisão**: Cada custo indica a etapa financeira afetada. Taxas `purchase` aumentam o custo de aquisição; taxas `sale` e `withdrawal` reduzem os recebimentos; taxas `conversion` indicam explicitamente se incidem na aquisição ou nos recebimentos. Converter cada preço e custo para BRL antes da soma ou subtração. Manter precisão decimal integral durante os cálculos e arredondar apenas os valores exibidos para duas casas decimais, usando half-up.

**Rationale**: Essa regra torna testável a composição do custo total e do valor líquido sem misturar taxas pagas em etapas diferentes. Taxas de saque não se aplicam a crédito da carteira Steam, que não é sacável.

**Alternativas consideradas**: Deduzir todas as taxas do preço de venda ou arredondar cada componente antes de somá-lo. Rejeitadas porque podem alterar o custo de aquisição, o valor líquido e o resultado por rota.

## Equivalência de itens

**Decisão**: Comparar float por igualdade decimal exata após normalização de zeros finais, sem tolerância. Comparar stickers como conjunto sem ordem de pares `(name, slot)`; comparar atributos especiais como conjunto sem ordem de pares nome/valor.

**Rationale**: A igualdade exata evita agrupar itens com floats diferentes e a comparação como conjunto evita que a ordem incidental das fixtures afete a identidade.

**Alternativas consideradas**: Aplicar tolerância ao float ou comparar stickers por posição na lista. Rejeitadas porque o MVP não definiu precisão de tolerância e a ordenação da lista não deve, por si só, alterar a identidade.

## Desempenho local

**Decisão**: Medir somente a atualização da lista local, sem rede, para até 200 cenários derivados. O alvo é até 200 ms no percentil 95 em 30 execuções no Chromium do Playwright.

**Rationale**: A feature não consulta Steam, CSFloat ou câmbio. Latência de endpoints externos não é um indicador válido para este MVP e deve ser definida quando uma integração real for especificada.

**Alternativas consideradas**: Definir SLA para respostas da Steam ou outro marketplace. Rejeitada porque nenhuma API externa pertence ao escopo atual.

## Liquidez e atualização

**Decisão**: Atribuir aos exemplos uma categoria simulada `baixa`, `média` ou `alta`, considerando volume, frequência de vendas e spread. Anúncios ativos são informação complementar, não base única da categoria. Ordenar as categorias nessa ordem e interpretar o filtro como categoria mínima inclusiva. Usar um horário de referência fixo por conjunto de fixtures para determinar a validade de 24 horas.

**Rationale**: Segue a clarification da feature e torna filtros e testes determinísticos sem inventar uma fórmula ou sugerir que os rótulos sejam uma classificação real.

**Alternativas consideradas**: Pontuação numérica de 0 a 100 ou cálculo derivado de fórmula fixa. Rejeitadas porque não há dados reais nem calibração para justificar precisão numérica no MVP.

## Testes

**Decisão**: Usar Vitest com utilitários Angular para funções de domínio e componentes; usar Playwright para validar o fluxo principal no navegador.

**Rationale**: Funções puras permitem testar cálculos, equivalência e filtros sem interface. Testes de componentes cobrem estados e rótulos; Playwright verifica a jornada da lista à comparação.

**Alternativas consideradas**: Apenas validação manual ou uma suíte E2E para todas as regras. A validação exclusivamente manual não dá repetibilidade aos cálculos; concentrar todas as regras em E2E torna os testes mais lentos e frágeis.

## Contratos e visualizações

**Decisão**: Não criar contratos externos nem diretório `contracts/`; a feature não expõe API ou integração. Não incluir Apache ECharts neste incremento, pois não há gráfico especificado. O serviço local e os tipos do domínio bastam para delimitar a interface interna.

**Rationale**: Mantém a implementação dentro da constituição e da feature aprovada; gráficos fazem mais sentido quando a feature de dashboard for especificada.

**Alternativas consideradas**: Criar contratos REST simulados ou adicionar gráficos de liquidez. Rejeitadas porque antecipariam integrações ou ampliariam o escopo da experiência atual.

## Acessibilidade e responsividade

**Decisão**: Validar uso integral por teclado, ordem e visibilidade do foco, rótulos acessíveis, contraste e apresentação de indicadores que não dependa apenas de cor. Validar a lista e o detalhe em viewport móvel, tablet e desktop; disponibilizar os dados de comparação em formato textual/tabular mesmo que um indicador visual seja usado.

**Rationale**: Atende aos princípios do produto sem assumir uma ferramenta de auditoria ou adicionar dependências antes de existir uma aplicação.

**Alternativas consideradas**: Tratar acessibilidade apenas como auditoria automatizada ou postergar a versão móvel. Rejeitadas porque não verificam adequadamente operação por teclado e podem esconder problemas de layout que afetam o uso principal.
