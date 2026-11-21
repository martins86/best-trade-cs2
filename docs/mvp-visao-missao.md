# Best Trade CS2 — Visão e Missão do MVP

**Versão:** 1.0  
**Data:** Novembro de 2026  
**Status:** Definição inicial

## Visão

Criar uma experiência web clara e confiável para explorar como diferenças de preços, taxas e liquidez entre marketplaces poderiam revelar oportunidades de negociação de skins de CS2.

Este MVP será uma demonstração interativa de inteligência de mercado, construída com dados mocados. Seu propósito é validar a organização das informações e os principais fluxos de análise antes de conectar o produto a fontes reais.

## Missão

Ajudar o usuário a comparar cenários simulados de compra e venda de skins, entender os fatores que influenciam uma oportunidade e encontrar informações relevantes por meio de filtros e indicadores apresentados de forma transparente.

## Problema que o MVP explora

A comparação entre marketplaces pode exigir que o usuário reúna preços, taxas, moedas e sinais de liquidez em diferentes lugares. O MVP explora como essas informações poderiam ser reunidas em uma interface para facilitar a análise, sem afirmar que os resultados simulados podem ser executados no mercado real.

## Usuário inicial

O MVP é voltado inicialmente ao próprio desenvolvedor, como ferramenta de aprendizado e validação da experiência do produto. A interface poderá ser avaliada por outras pessoas, mas não pressupõe cadastro, múltiplos perfis ou uso comercial.

## Escopo do MVP

O MVP deverá permitir:

- Visualizar um resumo de indicadores e oportunidades simuladas.
- Consultar uma lista de skins com preços fictícios atribuídos à Steam e à CSFloat.
- Comparar cenários nas duas direções: Steam para CSFloat e CSFloat para Steam.
- Exibir estimativas ilustrativas de taxas, custo de aquisição, valor líquido de venda, lucro e margem.
- Apresentar indicadores simulados de volume, anúncios e liquidez.
- Filtrar oportunidades por nome, faixa de preço, margem, liquidez e tipo de operação.
- Identificar claramente a origem simulada e a atualização fictícia dos dados.

## Fora do escopo

Esta primeira versão não deverá:

- Consultar APIs, páginas ou serviços reais de marketplaces ou câmbio.
- Armazenar dados em um backend ou banco de dados.
- Executar compras, vendas, saques ou qualquer outra operação financeira.
- Autenticar usuários ou conectar contas de marketplaces.
- Manter inventário, registrar operações reais ou calcular resultados financeiros realizados.
- Apresentar dados simulados como preços atuais ou oportunidades disponíveis para negociação.

## Princípios do produto

- **Transparência:** identificar dados, taxas, cotações e resultados como simulados.
- **Compreensão:** deixar visíveis os fatores usados em cada comparação.
- **Cautela:** não tratar estimativas como garantia de lucro ou recomendação financeira.
- **Foco:** validar primeiro os fluxos centrais de comparação e descoberta de oportunidades.
- **Evolução gradual:** manter as decisões do MVP simples; integrações reais e persistência serão avaliadas em etapas posteriores.

## Critérios de sucesso

O MVP será considerado bem-sucedido quando o usuário conseguir:

- Encontrar oportunidades simuladas e ordená-las ou filtrá-las.
- Comparar claramente os dois sentidos de operação.
- Entender como taxas e valores simulados afetam o resultado estimado.
- Reconhecer sem ambiguidade que os dados não são reais nem atualizados por marketplaces.

## Relação com a visão do produto

Este documento delimita a primeira etapa de interface do projeto descrito em [best-trade-cs2.md](best-trade-cs2.md). Ele não substitui aquela visão de longo prazo: integrações, coleta real de preços, persistência e gestão de operações permanecem possibilidades futuras, fora do escopo deste MVP.
