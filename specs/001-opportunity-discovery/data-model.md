# Modelo de dados: Descoberta de Oportunidades Simuladas

Este modelo descreve dados locais simulados para a feature; não implica persistência ou contrato de API.

## Tipos e entidades

### SkinIdentity

Representa a identidade do item que será comparado.

| Campo | Tipo conceitual | Regra |
|---|---|---|
| `id` | string | Identificador estável dentro do conjunto de fixtures. |
| `marketHashName` | string | Nome de mercado usado como parte da identidade. |
| `category` | string | Categoria apresentada ao usuário, quando disponível. |
| `wear` | string ou nulo | Exterior/desgaste. |
| `statTrak` | boolean | Indica se o item tem StatTrak. |
| `souvenir` | boolean | Indica se o item é Souvenir. |
| `floatValue` | decimal string ou nulo | Comparado numericamente com igualdade exata após normalização decimal, ignorando apenas zeros finais; sem tolerância. Deve estar presente nas duas referências ou em nenhuma. |
| `paintSeed` | inteiro ou nulo | Comparado quando presente nas duas referências. |
| `stickers` | lista de Sticker ou nulo | Comparada como conjunto sem ordem de pares `(name, slot)`; valores nulos de posição devem coincidir. |
| `specialAttributes` | lista de pares nome/valor | Comparada como conjunto sem ordem; nomes e valores devem coincidir exatamente. |

**Equivalência**: nome de mercado, wear, StatTrak, Souvenir e atributos de identidade disponíveis devem coincidir. `floatValue` é convertido para valor decimal antes da comparação, portanto `0.12` e `0.1200` são equivalentes, mas valores numericamente diferentes não são. Stickers são comparados sem considerar a ordem da lista, mas cada par `name`/`slot` deve coincidir. Se um atributo opcional relevante existir em apenas uma referência, a equivalência não é confirmada. Valores ausentes não são tratados como curinga.

### Sticker

| Campo | Tipo conceitual | Regra |
|---|---|---|
| `name` | string | Nome identificador do sticker. |
| `slot` | inteiro ou nulo | Posição no item, se conhecida. |

### PriceReference

Preço simulado observado para uma identidade em um marketplace.

| Campo | Tipo conceitual | Regra |
|---|---|---|
| `id` | string | Identificador estável da referência. |
| `skinIdentityId` | string | Referência a `SkinIdentity`. |
| `marketplace` | enum: `steam`, `csfloat` | Origem do preço. |
| `price` | decimal string | Preço original positivo; não usar ponto flutuante binário para calcular. |
| `currency` | enum: `BRL`, `USD` | Moeda original do preço. |
| `collectedAt` | data/hora ISO 8601 | Horário fictício da coleta. |
| `volume24h` | inteiro ou nulo | Volume simulado de vendas em 24 horas, quando disponível. |
| `salesFrequency` | decimal string ou nulo | Sinal de frequência de vendas simulado. |
| `spreadPercent` | decimal string ou nulo | Spread percentual simulado. |
| `activeListings` | inteiro ou nulo | Número ilustrativo de anúncios; não determina sozinho a liquidez. |
| `fees` | lista de FeeCost | Taxas/custos simulados associados à referência ou ao cenário. |

### FeeCost

| Campo | Tipo conceitual | Regra |
|---|---|---|
| `kind` | enum: `purchase`, `sale`, `conversion`, `withdrawal` | Tipo de custo. |
| `amount` | decimal string | Valor não negativo. |
| `currency` | enum: `BRL`, `USD` | Moeda do custo. |
| `label` | string | Descrição para exibição. |
| `appliesTo` | enum: `acquisition`, `proceeds` | Indica a etapa financeira afetada. `purchase` só pode incidir em `acquisition`; `sale` e `withdrawal` só podem incidir em `proceeds`; `conversion` pode incidir em qualquer uma. `withdrawal` só é válido quando o valor de destino permite saque. |

### FxQuote

Cotação simulada para converter valores comparáveis em BRL.

| Campo | Tipo conceitual | Regra |
|---|---|---|
| `baseCurrency` | enum: `BRL`, `USD` | Moeda de origem. |
| `quoteCurrency` | enum: `BRL`, `USD` | Moeda de destino. |
| `rate` | decimal string | Fator de conversão positivo. |
| `referenceTime` | data/hora ISO 8601 | Horário fictício de referência. |

### OpportunityScenario (derivada)

Comparação calculada, não duplicada como resultado nas fixtures.

| Campo | Tipo conceitual | Regra |
|---|---|---|
| `skinIdentityId` | string | Identidade da skin comparada. |
| `direction` | enum: `steam-to-csfloat`, `csfloat-to-steam` | Uma instância por sentido válido. |
| `buyReferenceId` | string | Referência do marketplace de compra. |
| `sellReferenceId` | string | Referência do marketplace de venda. |
| `status` | enum: `valid`, `incomplete`, `stale`, `not-equivalent` | Estado derivado de validade dos dados. |
| `liquidityCategory` | enum: `low`, `medium`, `high` | Rótulo fictício atribuído ao exemplo considerando volume, frequência e spread. Anúncios são complementares. |
| `costBasisBrl` | decimal | Custo total de aquisição convertido para BRL. |
| `netProceedsBrl` | decimal | Valor de venda convertido para BRL menos taxas/custos cujo `appliesTo` é `proceeds`. |
| `netResultBrl` | decimal | Valor líquido convertido para BRL menos custo de aquisição em BRL. |
| `marginPercent` | decimal | Resultado líquido dividido pelo custo total de aquisição, multiplicado por 100. |
| `proceedsKind` | enum: `cash`, `steam-wallet-credit` | Natureza do valor recebido no destino. Crédito Steam nunca é tratado como dinheiro sacável. |
| `dataReferenceTime` | data/hora ISO 8601 | Horário fixo usado para avaliar idade das referências. |

Os valores derivados são produzidos com Decimal.js. Cada preço e taxa é convertido individualmente para BRL antes de somas ou subtrações. Nenhuma etapa intermediária é arredondada; as interfaces apresentam valores monetários e margens com duas casas decimais usando arredondamento half-up, mantendo os valores de origem disponíveis para explicação.

## Regras de estado e cálculo

- Uma referência está desatualizada se `dataReferenceTime - collectedAt` for maior que 24 horas. Fixtures futuras em relação à referência são inválidas para a avaliação de idade.
- A disponibilidade dos dois sentidos é calculada separadamente; dado ausente ou desatualizado em um sentido não invalida automaticamente o outro.
- Um cenário `not-equivalent` não gera cálculo financeiro comparável.
- Um cenário `incomplete` não exibe resultado/margem como válidos.
- Um cenário válido pode ter resultado positivo, zero ou negativo. Os três permanecem na lista; zero/negativo recebem estado “não lucrativo”.
- `costBasisBrl` é o preço de compra convertido para BRL mais cada `FeeCost` convertido para BRL com `appliesTo = acquisition`.
- `netProceedsBrl` é o preço de venda convertido para BRL menos cada `FeeCost` convertido para BRL com `appliesTo = proceeds`.
- Taxas `purchase` incidem na aquisição; `sale` e `withdrawal` incidem nos recebimentos; `conversion` segue o valor de `appliesTo`. Taxa de saque não é aplicável a crédito Steam.
- `netResultBrl` é `netProceedsBrl - costBasisBrl`; `marginPercent` é `netResultBrl / costBasisBrl * 100`. Se `costBasisBrl` for zero ou negativo, não há margem válida.
- No sentido com venda na Steam, `proceedsKind` é `steam-wallet-credit`; resultado/margem são identificados como variação nominal em saldo Steam, nunca como retorno em dinheiro.
- As categorias de liquidez seguem `low < medium < high`. Um filtro mínimo inclui sua categoria e as superiores.
- Custo de aquisição zero ou negativo impede o cálculo de margem.

## Relacionamentos

- Uma `SkinIdentity` pode ter várias `PriceReference`, uma por marketplace e variação de observação.
- Uma `PriceReference` pertence a uma identidade e pode ter zero ou mais `FeeCost`.
- Uma `FxQuote` é usada por cenários cujos valores originais não estejam em BRL.
- Um par de referências equivalentes pode produzir até dois `OpportunityScenario`, um por direção.
