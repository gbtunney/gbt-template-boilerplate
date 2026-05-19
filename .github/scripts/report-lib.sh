#!/usr/bin/env bash

snail_sh() {
    local command_name="${1:-log}"
    shift || true

    case "$command_name" in
        section)
            printf '\n==== %s ====\n\n' "${1:-}"
            ;;
        kv_pair | status_pair)
            printf '%-24s %s\n' "${1:-}" "${2:-}"
            ;;
        log)
            printf '%s\n' "${1:-}"
            ;;
        spacer)
            local count="${1:-1}"
            local index
            for ((index = 0; index < count; index++)); do
                printf '\n'
            done
            ;;
        *)
            printf '%s' "$command_name"
            if (($# > 0)); then
                printf ' %s' "$@"
            fi
            printf '\n'
            ;;
    esac
}
