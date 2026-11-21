#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(CDPATH='' cd -- "$SCRIPT_DIR/../../.." && pwd)"
FEATURE_CONFIG="$REPO_ROOT/.specify/feature.json"

if [[ ! -f "$FEATURE_CONFIG" ]]; then
  echo "ERROR: .specify/feature.json não existe; não foi possível resolver a spec ativa." >&2
  exit 1
fi

FEATURE_DIR="$(python3 - "$FEATURE_CONFIG" <<'PY'
import json
import pathlib
import sys

config = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
feature_dir = config.get("feature_directory")
if not isinstance(feature_dir, str) or not feature_dir.strip():
    raise SystemExit("feature_directory ausente ou inválido em .specify/feature.json")
path = pathlib.PurePosixPath(feature_dir)
if path.is_absolute() or ".." in path.parts:
    raise SystemExit("feature_directory deve ser um caminho relativo dentro do workspace")
print(path.as_posix())
PY
)" || {
  echo "ERROR: configuração da feature ativa inválida." >&2
  exit 1
}

SPEC_FILE="$REPO_ROOT/$FEATURE_DIR/spec.md"
if [[ ! -f "$SPEC_FILE" ]]; then
  echo "ERROR: spec ativa não encontrada: $SPEC_FILE" >&2
  exit 1
fi

STATUS="$(python3 - "$SPEC_FILE" <<'PY'
import pathlib
import re
import sys

text = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")
statuses = re.findall(r"^\*\*Status\*\*:\s*(.*?)\s*$", text, re.MULTILINE | re.IGNORECASE)
if len(statuses) != 1:
    raise SystemExit(f"esperava exatamente uma linha Status; encontrei {len(statuses)}")
print(statuses[0])
PY
)" || {
  echo "ERROR: não foi possível validar o status da spec: $SPEC_FILE" >&2
  exit 1
}

if [[ "${STATUS,,}" != "approved" ]]; then
  echo "BLOCKED: implementação exige **Status**: Approved." >&2
  echo "Spec ativa: $SPEC_FILE" >&2
  echo "Status encontrado: ${STATUS:-ausente}" >&2
  echo "Revise e aprove a especificação antes de executar /speckit-implement." >&2
  exit 1
fi

echo "Spec aprovada: $SPEC_FILE"
