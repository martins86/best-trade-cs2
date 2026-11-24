#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$REPO_ROOT"

COMMIT_TYPE=""
COMMIT_MESSAGE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --commit-type) COMMIT_TYPE="${2:-}"; shift ;;
    --message) COMMIT_MESSAGE="${2:-}"; shift ;;
    *) echo "Argumento invalido: $1" >&2; exit 2 ;;
  esac
  shift
done

PACKAGE_JSON="$REPO_ROOT/frontend/package.json"

CURRENT_VERSION="$(python3 - "$PACKAGE_JSON" <<'PY'
import json
import pathlib
import sys

package = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
print(package["version"])
PY
)"

IFS=. read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
BUMP_KIND="$COMMIT_TYPE"

case "$COMMIT_TYPE" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  "")
    FEATURE_DIRECTORY="$(python3 - "$REPO_ROOT/.specify/feature.json" <<'PY'
import json
import pathlib
import sys
config = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
print(config["feature_directory"])
PY
)"
    SPEC_FILE="$REPO_ROOT/$FEATURE_DIRECTORY/spec.md"
    if [[ -f "$SPEC_FILE" ]] && grep -qiE 'breaking|incompat[ií]vel|mudanca incompat|mudança incompat' "$SPEC_FILE"; then
      MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0
      BUMP_KIND="major"
    elif [[ -f "$SPEC_FILE" ]] && grep -qiE 'nova funcionalidade|user story|funcionalidade|implementa(r|ção)|adicionar|criar|suporte' "$SPEC_FILE"; then
      MINOR=$((MINOR + 1)); PATCH=0
      BUMP_KIND="minor"
    else
      PATCH=$((PATCH + 1))
      BUMP_KIND="patch"
    fi
    ;;
  *) echo "Tipo de commit invalido: $COMMIT_TYPE" >&2; exit 2 ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

python3 - "$PACKAGE_JSON" "$NEW_VERSION" <<'PY'
import json
import pathlib
import sys

package_path = pathlib.Path(sys.argv[1])
version = sys.argv[2]

package = json.loads(package_path.read_text(encoding="utf-8"))
package["version"] = version
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
PY

LOCK_JSON="$REPO_ROOT/frontend/package-lock.json"
if [[ -f "$LOCK_JSON" ]]; then
  python3 - "$LOCK_JSON" "$NEW_VERSION" <<'PY'
import json
import pathlib
import sys

lock_path = pathlib.Path(sys.argv[1])
version = sys.argv[2]

lock = json.loads(lock_path.read_text(encoding="utf-8"))
packages = lock.get("packages")
if isinstance(packages, dict) and "" in packages:
    packages[""]["version"] = version
lock_path.write_text(json.dumps(lock, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
PY
fi

git add .

if git diff --cached --quiet; then
  echo "Nenhuma alteracao preparada; commit nao sera criado." >&2
  exit 1
fi

if [[ -z "$COMMIT_MESSAGE" ]]; then
  COMMIT_MESSAGE="$(
    git diff --cached --name-only |
      python3 - <<'PY'
import sys

paths = [line.strip() for line in sys.stdin if line.strip()]

if any("finalize-development.sh" in path or "speckit-finalize" in path for path in paths):
    print("corrige a finalizacao e o controle de versao do spec kit")
elif any(path.endswith("opportunity-performance.spec.ts") for path in paths):
    print("valida o desempenho dos filtros locais no playwright")
elif any(path.endswith("opportunity-discovery.spec.ts") for path in paths):
    print("adiciona a jornada e2e completa de descoberta")
elif any(path.endswith("opportunity-filter-bar.spec.ts") for path in paths):
    print("testa os controles e estados dos filtros")
elif any(path.endswith("opportunity-detail.page.spec.ts") for path in paths):
    print("testa os detalhes e os dois sentidos de comparacao")
elif any("opportunity-comparison.component" in path for path in paths):
    print("corrige a apresentacao dos resultados detalhados")
elif any(path.startswith("specs/") for path in paths):
    print("atualiza especificacao, checklist ou planejamento")
elif any(path.endswith("package.json") or path.endswith("package-lock.json") for path in paths):
    print("atualiza a versao e as dependencias do frontend")
else:
    print("atualiza a implementacao do app")
PY
  )"
fi

COMMIT_MESSAGE="${COMMIT_MESSAGE#feat!: }"
COMMIT_MESSAGE="${COMMIT_MESSAGE#feat: }"
COMMIT_MESSAGE="${COMMIT_MESSAGE#fix: }"

if [[ "$BUMP_KIND" == "major" ]]; then
  SUBJECT="feat!: $COMMIT_MESSAGE"
elif [[ "$BUMP_KIND" == "minor" ]]; then
  SUBJECT="feat: $COMMIT_MESSAGE"
else
  SUBJECT="fix: $COMMIT_MESSAGE"
fi

git commit -m "$SUBJECT" -m "Versao SemVer: $NEW_VERSION" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo "Versao atualizada: $CURRENT_VERSION -> $NEW_VERSION"
echo "Commit criado: $SUBJECT"
