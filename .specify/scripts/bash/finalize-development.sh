#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(CDPATH='' cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$REPO_ROOT"

SECURITY_CLEAN=false
COMMIT_TYPE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --security-clean) SECURITY_CLEAN=true ;;
    --commit-type) COMMIT_TYPE="${2:-}"; shift ;;
    *) echo "Argumento invalido: $1" >&2; exit 2 ;;
  esac
  shift
done

if [[ "$SECURITY_CLEAN" != "true" ]]; then
  echo "BLOCKED: revisao de seguranca nao foi confirmada como limpa." >&2
  exit 1
fi

PACKAGE_JSON="$REPO_ROOT/frontend/package.json"
PACKAGE_LOCK="$REPO_ROOT/frontend/package-lock.json"

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

python3 - "$PACKAGE_JSON" "$PACKAGE_LOCK" "$NEW_VERSION" <<'PY'
import json
import pathlib
import sys

package_path = pathlib.Path(sys.argv[1])
lock_path = pathlib.Path(sys.argv[2])
version = sys.argv[3]

package = json.loads(package_path.read_text(encoding="utf-8"))
package["version"] = version
package_path.write_text(json.dumps(package, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

lock = json.loads(lock_path.read_text(encoding="utf-8"))
lock["version"] = version
if isinstance(lock.get("packages"), dict) and "" in lock["packages"]:
    lock["packages"][""]["version"] = version
lock_path.write_text(json.dumps(lock, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
PY

git add .

if git diff --cached --quiet; then
  echo "Nenhuma alteracao preparada; commit nao sera criado." >&2
  exit 1
fi

FEATURE_TITLE="$(
  python3 - "$REPO_ROOT/.specify/feature.json" <<'PY'
import json
import pathlib
import re
import sys

repo = pathlib.Path(sys.argv[1]).resolve().parent.parent
config = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding="utf-8"))
spec = repo / config["feature_directory"] / "spec.md"
match = re.search(r"^# Feature Specification:\s*(.+)$", spec.read_text(encoding="utf-8"), re.MULTILINE)
print(match.group(1).strip() if match else "atualiza a aplicacao")
PY
)"

if [[ "$BUMP_KIND" == "major" ]]; then
  SUBJECT="feat!: $FEATURE_TITLE"
elif [[ "$BUMP_KIND" == "minor" ]]; then
  SUBJECT="feat: $FEATURE_TITLE"
else
  SUBJECT="fix: $FEATURE_TITLE"
fi

SUBJECT="${SUBJECT,,}"

git commit -m "$SUBJECT" -m "Versao SemVer: $NEW_VERSION" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo "Versao atualizada: $CURRENT_VERSION -> $NEW_VERSION"
echo "Commit criado: $SUBJECT"
