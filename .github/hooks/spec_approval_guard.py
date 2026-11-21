#!/usr/bin/env python3
"""Block implementation edits while the active feature spec is not approved."""

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
FEATURE_CONFIG = ROOT / ".specify" / "feature.json"

MUTATING_TOOLS = {
    "apply_patch",
    "create_file",
    "delete_file",
    "multi_replace_string_in_file",
    "rename_file",
    "replace_string_in_file",
    "write_file",
}
PATH_KEYS = {"filePath", "file_path", "path", "target", "uri"}
PATCH_PATH = re.compile(r"^\*\*\* (?:Update|Add|Delete) File: (.+?)\s*$", re.MULTILINE)


def block(reason: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    raise SystemExit(2)


def active_spec() -> tuple[pathlib.Path, str]:
    if not FEATURE_CONFIG.is_file():
        raise ValueError(".specify/feature.json não existe")
    config = json.loads(FEATURE_CONFIG.read_text(encoding="utf-8"))
    feature_dir = config.get("feature_directory")
    if not isinstance(feature_dir, str) or not feature_dir.strip():
        raise ValueError("feature_directory ausente em .specify/feature.json")
    feature_path = (ROOT / feature_dir).resolve()
    if not feature_path.is_relative_to(ROOT.resolve()):
        raise ValueError("feature_directory aponta para fora do workspace")
    spec_path = feature_path / "spec.md"
    if not spec_path.is_file():
        raise ValueError(f"spec ativa não encontrada: {spec_path}")
    statuses = re.findall(
        r"^\*\*Status\*\*:\s*(.*?)\s*$",
        spec_path.read_text(encoding="utf-8"),
        re.MULTILINE | re.IGNORECASE,
    )
    if len(statuses) != 1:
        raise ValueError(f"a spec ativa deve conter uma linha Status única; encontradas: {len(statuses)}")
    return spec_path, statuses[0]


def collect_paths(value: object, found: list[str]) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key in PATH_KEYS and isinstance(child, str):
                found.append(child)
            elif key in {"input", "patch", "diff"} and isinstance(child, str):
                found.extend(PATCH_PATH.findall(child))
            collect_paths(child, found)
    elif isinstance(value, list):
        for child in value:
            collect_paths(child, found)


def is_planning_path(path_value: str, feature_dir: pathlib.Path) -> bool:
    candidate = pathlib.Path(path_value)
    if not candidate.is_absolute():
        candidate = ROOT / candidate
    try:
        candidate = candidate.resolve()
        candidate.relative_to(ROOT.resolve())
    except (OSError, ValueError):
        return False

    allowed_root = feature_dir.resolve()
    return candidate == allowed_root or allowed_root in candidate.parents


def terminal_command_is_mutating(command: str) -> bool:
    value = command.strip()
    if not value:
        return False

    value = re.sub(r"^(?:cd\s+[^;&|]+\s*&&\s*)+", "", value)
    if re.search(r"[;&|<>`\n]", value) or "$((" in value or "$(`" in value:
        return True
    if re.match(r"(?:sed|perl)\s+-[^\s]*i", value):
        return True

    safe_commands = (
        r"git\s+(?:status|diff|log|show|rev-parse|branch\s+--show-current)\b",
        r"(?:npm\s+(?:test|start)|npm\s+run\s+(?:test|build|e2e)|npx\s+playwright\s+test)\b",
        r"(?:rg|grep|find|cat|sed|nl|head|tail|wc|pwd|ls|stat|file)\b",
        r"\.specify/scripts/bash/(?:check-prerequisites|setup-plan|setup-tasks|resolve-template|validate-spec-approved)\.sh\b",
    )
    return not any(re.match(pattern, value) for pattern in safe_commands)


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, OSError):
        return

    tool_name = str(payload.get("toolName", payload.get("tool_name", ""))).split(".")[-1]
    tool_input = payload.get("toolInput", payload.get("tool_input", {}))

    if tool_name in MUTATING_TOOLS:
        paths: list[str] = []
        collect_paths(tool_input, paths)
        mutating = True
    elif tool_name in {"run_in_terminal", "terminal"}:
        command = str(tool_input.get("command", "")) if isinstance(tool_input, dict) else ""
        mutating = terminal_command_is_mutating(command)
        paths = []
    else:
        return

    if not mutating:
        return

    try:
        spec_path, status = active_spec()
    except (OSError, ValueError, json.JSONDecodeError) as error:
        block(f"Edição bloqueada: não foi possível confirmar aprovação da spec ativa ({error}).")

    if status.strip().casefold() == "approved":
        return

    if tool_name in MUTATING_TOOLS and paths:
        feature_dir = spec_path.parent
        if all(is_planning_path(path, feature_dir) for path in paths):
            return

    block(
        f"Edição de implementação bloqueada: a spec ativa está '{status}'. "
        "Altere/revise apenas os artefatos de planejamento e defina **Status**: Approved "
        "após aprovação antes de editar código."
    )


if __name__ == "__main__":
    main()
