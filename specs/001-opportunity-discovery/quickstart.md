# Quickstart: Descoberta de Oportunidades Simuladas

Este guia descreve como executar e validar a feature depois que o esqueleto Angular for criado na pasta `frontend/` conforme [plan.md](plan.md). Não requer contas ou credenciais de marketplaces.

## Pré-requisitos

- Node.js e npm em versões suportadas pelo Angular CLI 22.x escolhido para o projeto.
- Navegador moderno.
- Dependências do projeto instaladas na pasta `frontend/`.

## Executar localmente

```bash
cd frontend
npm ci
npm start
```

Abra a URL local indicada pelo Angular CLI. A página deve carregar dados fixos simulados sem solicitar dados a Steam, CSFloat ou a um provedor de câmbio.

## Validar testes

```bash
cd frontend
npm test -- --watch=false
npx playwright test
npx playwright test e2e/opportunity-performance.spec.ts
```

O primeiro comando deve validar cálculos, equivalência, liquidez, filtros, ordenação e estados de componentes. O segundo valida a jornada no navegador; o servidor local deve ser iniciado pela configuração de execução do Playwright. O terceiro mede somente filtro/ordenação local, sem chamadas a APIs.

## Cenários de aceitação manuais

1. Confirme que cada preço mostra marketplace, moeda original, horário simulado e indicação de dados fictícios.
2. Consulte os cenários Steam → CSFloat e CSFloat → Steam de uma skin equivalente; confirme que são exibidos separadamente.
3. Verifique que saldo Steam está identificado como não sacável e não é apresentado como dinheiro disponível.
4. Confirme que comparações válidas positivas, nulas e negativas aparecem, com as duas últimas identificadas como não lucrativas.
5. Confirme que referências com mais de 24 horas em relação ao horário fixo do dataset são marcadas como desatualizadas e não sustentam uma oportunidade disponível.
6. Filtre por nome, custo, margem mínima, categoria mínima de liquidez e direção; confirme que todos os filtros são aplicados conjuntamente.
7. Selecione liquidez mínima `média`; somente resultados `média` ou `alta` devem permanecer. Limpe os filtros e confirme que a lista original retorna.
8. Ordene por resultado, margem e liquidez. Resultado estimado é ordenado separadamente por sentido; categorias de liquidez seguem `baixa`, `média`, `alta`.
9. Verifique resultados vazios, referências incompletas e pares de itens não equivalentes; nenhum deve ser apresentado como oportunidade calculada válida.
10. Repita o fluxo em viewport móvel, tablet e desktop e navegue pelos controles usando somente teclado.

## Desempenho dos dados locais

Use fixtures com até 100 identidades de skins e 200 cenários direcionais. No Chromium do Playwright, meça 30 alterações de filtro ou ordenação, após aquecer a página, até a lista atualizada ficar visível. O percentil 95 deve ser de até 200 ms. Desative chamadas de rede durante a medição; latência de APIs externas não faz parte deste MVP.

## Avaliação de usabilidade

**Status:** Adiada para uma etapa posterior por decisão do projeto. Não faz parte da entrega atual.

Convide cinco participantes que não tenham recebido instruções sobre os controles. Apresente somente esta tarefa: “Encontre uma comparação com margem mínima de 3% e liquidez média ou alta”. Meça o tempo do início até a pessoa identificar um resultado correspondente; o critério é pelo menos quatro de cinco participantes concluírem em até dois minutos. Registre no máximo quantidade de sucessos e tempos, sem nomes ou outros dados pessoais, nesta seção.

## Resultado esperado

A feature funciona integralmente com fixtures locais, sem requisições de rede a serviços de mercado. Todos os cenários acima correspondem às regras em [spec.md](spec.md); divergências devem ser corrigidas na especificação ou nos artefatos derivados antes de considerar a feature pronta.
