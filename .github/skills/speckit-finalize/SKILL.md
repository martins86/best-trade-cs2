---
name: "speckit-finalize"
description: "Finalize development with SemVer, git add and Portuguese commit"
compatibility: "Requires a git repository"
metadata:
  author: "github-spec-kit"
  source: "project-release-extension"
  version: "1.0.0"
---

# Controle de versao e commit

Execute `.specify/scripts/bash/finalize-development.sh --commit-type <major|minor|patch>`.

As regras sao:

- MAJOR para quebra incompativel.
- MINOR para nova funcionalidade sem quebra.
- PATCH para correcoes e ajustes.
- Atualizar `frontend/package.json` e o primeiro bloco `packages[""]` de `frontend/package-lock.json`.
- Executar `git add .`.
- Criar commit Conventional Commits em portugues do Brasil.
- Incluir o trailer Copilot.
