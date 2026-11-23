# Research: Roteamento GitHub Pages e Marca

## Decisão 1: Fallback SPA no GitHub Pages

**Decision**: Publicar uma cópia de `index.html` como `404.html` no diretório estático do build.

**Rationale**: Quando `/best-trade-cs2/opportunities` não corresponde a um arquivo físico, o GitHub Pages pode entregar `404.html`. Uma cópia completa do HTML da aplicação carrega os bundles Angular com o `<base href="/best-trade-cs2/">` existente, permitindo que o Angular Router reconheça o caminho atual. Isso requer apenas configuração de build/publicação e não cria backend.

**Alternatives considered**:
- Reescrita de servidor: não disponível no GitHub Pages.
- Hash routing: manteria links em formato com `#`, mas não atenderia diretamente à URL `/opportunities` solicitada.
- Redirect JavaScript manual para `/`: impediria o carregamento direto da rota e não preservaria o caminho solicitado de forma transparente.

## Decisão 2: Fallback de rota desconhecida

**Decision**: Manter o wildcard existente do Angular, que redireciona caminhos desconhecidos para `/opportunities`.

**Rationale**: A regra já existe no roteador e oferece comportamento consistente em servidor e navegação interna.

**Alternatives considered**:
- Página 404 personalizada: reduziria a chance de carregar a aplicação e exigiria uma nova tela fora do escopo.
- Listar rotas conhecidas em `404.html`: duplicaria a configuração do Angular sem necessidade.

## Decisão 3: Identidade da marca

**Decision**: Atualizar o título HTML e o nome exibido no shell para "Best Trade CS2".

**Rationale**: Essas são as duas identificações principais da marca no navegador e na aplicação.

**Alternatives considered**:
- Atualizar toda a documentação: útil como fase posterior, mas fora do ajuste imediato da interface publicada.
- Renomear módulos ou rotas internos: não adiciona valor ao usuário e aumenta o risco de alterações indevidas.
