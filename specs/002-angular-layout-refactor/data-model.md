# Data Model: Refactor do Layout Angular

O refactor não cria entidades financeiras novas. Os cenários continuam sendo definidos pela feature 001. Este documento descreve apenas estado de apresentação necessário à nova interface.

## ApplicationShell

Representa o shell compartilhado.

| Campo | Tipo | Regra |
|---|---|---|
| activeDestination | string | Identifica rota ou área atual |
| compactDesktop | boolean | Indica sidebar reduzida no breakpoint intermediário |
| mobileMenuOpen | boolean | Indica menu móvel visível |
| theme | `dark` ou `light` | Tema ativo da interface |

## NavigationDestination

Representa uma entrada da navegação.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador estável |
| label | string | Texto apresentado ao usuário |
| route | string ou nulo | Rota disponível; nulo indica destino futuro |
| available | boolean | Indica se o destino pertence ao MVP atual |
| icon | string | Símbolo ou nome de ícone Material |

Destinos futuros devem aparecer visualmente apenas como indisponíveis, sem navegar para página vazia.

## ThemePreference

Representa a preferência persistida no navegador.

| Campo | Tipo | Regra |
|---|---|---|
| theme | `dark` ou `light` | Preferência efetiva |

Ausência ou valor inválido usa `dark`. A preferência não é enviada ao backend.

## OpportunityRow

Representa uma linha derivada de `OpportunityScenario` e `SkinIdentity`.

| Campo | Tipo | Regra |
|---|---|---|
| skinIdentityId | string | Identificador da skin |
| skinName | string | Nome de mercado da skin |
| direction | enum | Steam → CSFloat ou CSFloat → Steam |
| costBasisBrl | decimal string | Custo já calculado pelo domínio |
| netProceedsBrl | decimal string | Proceeds já calculado pelo domínio |
| netResultBrl | decimal string | Resultado já calculado pelo domínio |
| marginPercent | decimal string | Margem já calculada pelo domínio |
| liquidityCategory | enum | baixa, média ou alta |
| status | enum | válido, incompleto, desatualizado ou não equivalente |
| proceedsKind | enum | dinheiro ou crédito Steam |

A apresentação não recalcula os campos financeiros. Estados inválidos podem mostrar texto de indisponibilidade, mas não converter valores vazios em zero.

## DashboardIndicator

Representa uma métrica derivada da coleção atual.

| Campo | Tipo | Regra |
|---|---|---|
| id | string | Identificador estável |
| label | string | Nome da métrica |
| value | decimal, inteiro ou categoria | Valor derivado somente dos cenários locais |
| detail | string | Contexto ou explicação simulada |

Não persistir indicadores como dados independentes. Exemplos possíveis: oportunidades válidas, cenários não lucrativos, liquidez alta e margem média.

## FilterState

Reutiliza a estrutura existente de filtros da feature 001.

| Campo | Tipo | Regra |
|---|---|---|
| search | string | Busca parcial sem distinção de caixa |
| costMin | número ou nulo | Limite inclusivo opcional |
| costMax | número ou nulo | Limite inclusivo opcional |
| marginMin | número ou nulo | Limite inclusivo opcional |
| liquidityMin | categoria ou nulo | Baixa, média ou alta |
| direction | direção ou nulo | Sentido Steam → CSFloat, CSFloat → Steam ou todos |

Faixa mínima maior que máxima é inválida. Nenhum filtro é aplicado enquanto a faixa estiver inválida.
