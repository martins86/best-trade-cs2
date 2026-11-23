# Quickstart: Roteamento GitHub Pages e Marca

## Pré-requisitos

- Node.js compatível com o projeto Angular.
- Dependências instaladas em `frontend/`.

## Instalação

```bash
npm ci --prefix frontend
```

## Validação local

```bash
npm test --prefix frontend
npm run e2e --prefix frontend
npm run build --prefix frontend -- --base-href /best-trade-cs2/
```

## Cenários esperados

1. Abrir o build publicado diretamente em `/best-trade-cs2/opportunities`.
   - A página de oportunidades deve aparecer.
   - Atualizar o navegador deve manter a página acessível.

2. Abrir uma rota conhecida existente de detalhes em uma nova sessão.
   - A aplicação deve resolver o caminho conhecido.

3. Abrir uma rota desconhecida.
   - O Angular deve redirecionar para `/opportunities`.

4. Consultar o shell da aplicação.
   - O nome exibido deve ser "Best Trade CS2".
   - O título do navegador deve identificar "Best Trade CS2".
   - "CS2 Market" não deve aparecer em identificação visual.

## Verificação do artefato publicado

Após o build com base `/best-trade-cs2/`, o diretório publicado deve conter:

- `index.html`
- `404.html` com o mesmo bootstrap da aplicação
- bundles e recursos referenciados pelo prefixo `/best-trade-cs2/`
