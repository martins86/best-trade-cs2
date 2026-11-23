# Data Model: Roteamento GitHub Pages e Marca

## PublicApplicationRoute

Representa um caminho público resolvido pelo GitHub Pages e pelo Angular Router.

- **path**: caminho conhecido ou desconhecido solicitado pelo navegador.
- **basePrefix**: prefixo público `/best-trade-cs2/`.
- **fallbackFile**: arquivo estático usado quando o caminho não existe fisicamente.
- **targetRoute**: rota Angular correspondente.

### Regras

- `/opportunities` MUST ser servido pela aplicação e associado à lista de oportunidades.
- `/opportunities/:skinId` MUST permanecer uma rota conhecida existente.
- Caminhos desconhecidos MUST ser redirecionados para `/opportunities`.

## BrandIdentity

Representa o nome oficial exibido pela aplicação.

- **displayName**: valor oficial exibido no shell.
- **pageTitle**: valor mostrado no título da página pelo navegador.

### Regras

- `displayName` MUST ser exatamente "Best Trade CS2".
- `pageTitle` MUST identificar a página como "Best Trade CS2".
- "CS2 Market" MUST NOT permanecer em identificação visual publicada.
