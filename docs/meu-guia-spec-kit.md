# Spec Kit no Best Trade CS2

Este projeto usa o GitHub Spec Kit na versão **1.4.3** com integração do
GitHub Copilot. Os comandos são disponibilizados como skills em
`.github/skills/` e, no Copilot Chat, normalmente são invocados pelo formato
`/speckit-<comando>`.

Os artefatos gerados ficam em:

- constituição: `.specify/memory/constitution.md`;
- especificações e planos: `specs/<numero>-<nome>/`;
- configurações e scripts: `.specify/`;
- hooks do projeto: `.specify/extensions.yml` e `.github/hooks/`.

## Instalar o UV

Consulte a documentação oficial em https://docs.astral.sh/uv/

Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Instalar o Spec Kit

Documentação oficial:
https://github.github.com/spec-kit/installation.html

Linux:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.4.3
```

Inicialize o Spec Kit na raiz do repositório:

```bash
specify init --here
```

Para este projeto, a integração foi instalada com Copilot e pode ser conferida
em `.specify/integration.json`.

## Referência dos comandos

Execute os comandos em um ciclo por funcionalidade. Os passos marcados como
condicionais são necessários apenas quando houver ambiguidade ou alterações
importantes.

| Ordem | Comando no Copilot | Quando executar | Artefato ou resultado |
|---:|---|---|---|
| 1 | `/speckit-constitution` | Uma vez no início do projeto e sempre que os princípios precisarem mudar. | Preenche ou atualiza `.specify/memory/constitution.md`. |
| 2 | `/speckit-specify` | Para iniciar uma nova funcionalidade, fornecendo uma descrição clara do comportamento. | Cria `specs/<numero>-<nome>/spec.md` e define o status inicial como `Draft`. |
| 3 | `/speckit-clarify` | Opcional, mas recomendado antes do plano quando existirem requisitos ambíguos ou subjetivos. | Atualiza a especificação com respostas e decisões verificáveis. |
| 4 | `/speckit-plan` | Após revisar e esclarecer a especificação. | Gera `plan.md` e os artefatos técnicos necessários. |
| 5 | `/speckit-checklist` | Antes de decompor o trabalho, especialmente em requisitos complexos ou de alto risco. | Cria ou atualiza checklists de qualidade e revisabilidade. |
| 6 | `/speckit-tasks` | Depois que especificação e plano estiverem consistentes e revisados. | Gera `tasks.md` com tarefas ordenadas por dependência. |
| 7 | `/speckit-analyze` | Antes da aprovação da especificação e antes da implementação; nunca altera arquivos. | Verifica constituição, especificação, plano e tarefas e informa inconsistências. |
| 8 | Aprovação manual da spec | Depois que os artefatos da funcionalidade forem revisados e a análise estiver limpa. | Alterar a linha `**Status**` da `spec.md` ativa para `Approved`. |
| 9 | `/speckit-implement` | Somente após a especificação ativa estar aprovada e a lista de tarefas estar completa. | Implementa `tasks.md` em ordem, mas não avança enquanto o status não for `Approved`. |
| 10 | `/speckit-converge` | Após a implementação e os testes relevantes. | Compara implementação, especificação, plano e tarefas; converte lacunas reais em novas tarefas. |

Os comandos `/speckit-clarify`, `/speckit-checklist` e `/speckit-converge`
podem ser repetidos durante o ciclo quando forem encontrados novos requisitos,
ambiguidades ou lacunas. O comando `/speckit-analyze` é somente leitura e não
deve ser usado para editar artefatos.

## Hooks usados neste projeto

Os hooks abaixo fazem a validação automática das etapas e podem executar outros
comandos do Spec Kit. Eles não substituem a revisão humana.

### Hooks de fluxo

Configurados em [`.specify/extensions.yml`](../.specify/extensions.yml):

| Momento | Comando | Obrigatório | Comportamento |
|---|---|---:|---|
| Antes de `/speckit-tasks` | `/speckit-checklist` | Não | Gera ou revisa uma checklist da especificação e do plano. |
| Depois de `/speckit-tasks` | `/speckit-analyze` | Sim | Verifica consistência entre constituição, especificação, plano e tarefas. |
| Antes de `/speckit-implement` | `/speckit-analyze` | Sim | Bloqueia a implementação quando os artefatos ainda têm inconsistências relevantes. |
| Depois de `/speckit-implement` | `/speckit-converge` | Sim | Compara o resultado implementado com os artefatos e registra lacunas reais como tarefas. |

Hooks desativados por `enabled: false` não são executados. Hooks com
`optional: false` são obrigatórios no fluxo.

### Hook de aprovação de implementação

Configurado em [`.github/hooks/spec-approval.json`](../.github/hooks/spec-approval.json),
o hook `PreToolUse` executa:

```bash
python3 .github/hooks/spec_approval_guard.py
```

O guardião [`.github/hooks/spec_approval_guard.py`](../.github/hooks/spec_approval_guard.py):

- exige a existência de uma especificação ativa configurada pela feature atual;
- exige uma única linha `**Status**: Approved` na `spec.md`;
- permite editar somente os artefatos da feature enquanto ela não estiver aprovada;
- bloqueia alterações de implementação em código, testes e outros arquivos fora
  da pasta da feature;
- bloqueia comandos mutáveis no terminal até a aprovação;
- permite scripts de consulta e validação necessários ao fluxo.

A implementação pode ser iniciada apenas depois de definir explicitamente:

```markdown
**Status**: Approved
```

O projeto também executa `.specify/scripts/bash/validate-spec-approved.sh`
como validação adicional antes de `/speckit-implement`.

## Ordem completa recomendada

Para uma funcionalidade nova:

```text
constitution -> specify -> clarify -> plan -> checklist -> tasks
-> analyze -> revisar e aprovar spec -> implement -> converge
```

Durante o ciclo, os hooks deste projeto acrescentam as seguintes verificações:

```text
before_tasks:  speckit-checklist (opcional)
after_tasks:   speckit-analyze (obrigatório)
before_implement: speckit-analyze (obrigatório)
                   validar Status: Approved
after_implement:  speckit-converge (obrigatório)
```
