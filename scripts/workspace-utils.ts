import { execCommand, getExecCommandOutput } from './lib/shell-utilities.js'
import path from 'node:path'

//todo: move to sh utils

export type WorkspacePackage = {
    name: string
    path: string
    version: string
    private: boolean
    // "dependencies": {}
}

export function getWorkspacePackagesList(
    filter?: (pkg: WorkspacePackage) => boolean,
): Array<WorkspacePackage> {
    const out = getExecCommandOutput('pnpm list -r --depth -1 --json')

    if (!out.success) {
        return []
    }

    const pkgList = JSON.parse(out.result) as Array<WorkspacePackage>

    return filter ? pkgList.filter(filter) : pkgList
}

/**
 * Transform a workspace packages lookup back into an array.
 *
 * - For Map<name, pkg> -> returns WorkspacePackage[]
 * - For Record<name, pkg> -> returns WorkspacePackage[]
 */
export function workspacePackagesToArray(
    input:
        | ReadonlyMap<string, WorkspacePackage>
        | Record<string, WorkspacePackage>,
): Array<WorkspacePackage> {
    if (input instanceof Map) {
        return Array.from<WorkspacePackage>(input.values())
    }
    return Object.values<WorkspacePackage>(
        input as Record<string, WorkspacePackage>,
    )
}

/** Map<packageName, packagePath> */
export function getWorkspacePackagesLookup(
    ...args: Parameters<typeof getWorkspacePackagesList>
): Map<string, WorkspacePackage> {
    const pkgObject: Record<string, WorkspacePackage> =
        getWorkspacePackagesObject(...args)
    return new Map(Object.entries(pkgObject))
}

export function getWorkspacePackagesObject(
    filter?: (pkg: WorkspacePackage) => boolean,
): Record<string, WorkspacePackage>
export function getWorkspacePackagesObject<Result>(
    filter: ((pkg: WorkspacePackage) => boolean) | undefined,
    mapValue: (pkg: WorkspacePackage, name: string, index: number) => Result,
): Record<string, Result>
export function getWorkspacePackagesObject<Result>(
    filter?: (pkg: WorkspacePackage) => boolean,
    mapValue?: (pkg: WorkspacePackage, name: string, index: number) => Result,
) {
    const pkgs = getWorkspacePackagesList(filter)

    if (!mapValue) {
        return Object.fromEntries(
            pkgs.map((pkg) => [pkg.name, pkg] as const),
        ) as Record<string, WorkspacePackage>
    }

    return Object.fromEntries(
        pkgs.map((pkg, i) => [pkg.name, mapValue(pkg, pkg.name, i)] as const),
    ) as Record<string, Result>
}

/** Workspace root path */
export function getWorkspaceNodeModulesRoot(): string | undefined {
    const _return = getExecCommandOutput('pnpm root -w')
    return _return.success ? _return.result.trim() : undefined
}

export const getRepoRoot = (): string | undefined => {
    const _return = getExecCommandOutput('git rev-parse --show-toplevel')
    return _return.success ? _return.result.trim() : undefined
    //
    // || process.cwd()
}

type KeyMode = 'include' | 'exclude'

/** Overloads give precise return types based on `mode` */
function setPackageKeys<Key extends keyof WorkspacePackage>(
    pkg: WorkspacePackage,
    mode: 'include',
    keys: ReadonlyArray<Key>,
): Pick<WorkspacePackage, Key>
function setPackageKeys<Key extends keyof WorkspacePackage>(
    pkg: WorkspacePackage,
    mode: 'exclude',
    keys: ReadonlyArray<Key>,
): Omit<WorkspacePackage, Key>
function setPackageKeys<Key extends keyof WorkspacePackage>(
    pkg: WorkspacePackage,
    mode: KeyMode,
    keys: ReadonlyArray<Key>,
) {
    if (mode === 'include') {
        return Object.fromEntries(keys.map((key) => [key, pkg[key]])) as Pick<
            WorkspacePackage,
            Key
        >
    }

    return Object.fromEntries(
        (Object.keys(pkg) as Array<keyof WorkspacePackage>)
            .filter(
                (key) =>
                    !(keys as ReadonlyArray<keyof WorkspacePackage>).includes(
                        key,
                    ),
            )
            .map((key) => [key, pkg[key]]),
    ) as Omit<WorkspacePackage, Key>
}

function setAllPackageKeys<Key extends keyof WorkspacePackage>(
    pkgs: ReadonlyArray<WorkspacePackage>,
    mode: 'include',
    keys: ReadonlyArray<Key>,
): Array<Pick<WorkspacePackage, Key>>
function setAllPackageKeys<Key extends keyof WorkspacePackage>(
    pkgs: ReadonlyArray<WorkspacePackage>,
    mode: 'exclude',
    keys: ReadonlyArray<Key>,
): Array<Omit<WorkspacePackage, Key>>
function setAllPackageKeys<Key extends keyof WorkspacePackage>(
    pkgs: ReadonlyArray<WorkspacePackage>,
    mode: KeyMode,
    keys: ReadonlyArray<Key>,
) {
    if (mode === 'include') {
        return pkgs.map((pkg) => setPackageKeys(pkg, mode, keys))
    }
    return pkgs.map((pkg) => setPackageKeys(pkg, mode, keys))
}

function setAllPackageKeysExcluding<Key extends keyof WorkspacePackage>(
    pkgs: ReadonlyArray<WorkspacePackage>,
    mode: 'include',
    keys: ReadonlyArray<Key>,
): Array<Pick<WorkspacePackage, Key>>
function setAllPackageKeysExcluding<Key extends keyof WorkspacePackage>(
    pkgs: ReadonlyArray<WorkspacePackage>,
    mode: 'exclude',
    keys: ReadonlyArray<Key>,
): Array<Omit<WorkspacePackage, Key>>
function setAllPackageKeysExcluding<Key extends keyof WorkspacePackage>(
    pkgs: ReadonlyArray<WorkspacePackage>,
    mode: KeyMode,
    keys: ReadonlyArray<Key>,
) {
    if (mode === 'include') {
        return pkgs.map((pkg) => setPackageKeys(pkg, mode, keys))
    }
    return pkgs.map((pkg) => setPackageKeys(pkg, mode, keys))
}

type GitChangedFilesOptions = {
    base?: string
    head?: string
    includeStaged?: boolean
    includeUnstaged?: boolean
    includeUntracked?: boolean
}

function splitNonEmptyLines(text: string): Array<string> {
    return text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
}

function isInsideDir(absChildPath: string, absParentDir: string): boolean {
    const rel = path.relative(absParentDir, absChildPath)
    // inside if relative path doesn't go up/out and isn't absolute
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

export function getGitChangedFiles(
    options: GitChangedFilesOptions = {},
): Array<string> {
    const {
        base,
        head,
        includeStaged = true,
        includeUnstaged = true,
        includeUntracked = true,
    } = options

    const files = new Set<string>()

    const add = (cmd: string) => {
        const out = getExecCommandOutput(cmd)
        if (!out.success) return
        for (const f of splitNonEmptyLines(out.result)) files.add(f)
    }

    if (base && head) add(`git diff --name-only ${base}...${head}`)
    if (includeStaged) add('git diff --name-only --cached')
    if (includeUnstaged) add('git diff --name-only')
    if (includeUntracked) add('git ls-files --others --exclude-standard')

    return [...files]
}

/**
 * Returns workspace packages that have at least one changed file within their directory.
 *
 * Uses filesystem path semantics (path.resolve/relative) rather than string-prefix logic.
 */
export function getChangedWorkspacePackagesFromGit(
    options: GitChangedFilesOptions = {},
): Array<WorkspacePackage> {
    const repoRoot = getRepoRoot()
    if (!repoRoot)
        throw new Error(
            'Unable to determine git repository root. Are you sure you are in a git repository?',
        )
    const pkgs = getWorkspacePackagesList()
    const changed = getGitChangedFiles(options)

    const pkgDirs = pkgs
        .map((pkg) => ({
            pkg,
            // pkg.path might be "packages/foo" or an absolute path; resolve covers both.
            absDir: path.resolve(repoRoot, pkg.path),
        }))
        // longer paths first so nested packages win if it ever happens
        .sort((a, b) => b.absDir.length - a.absDir.length)

    const hit = new Map<string, WorkspacePackage>()

    for (const repoRelativeFile of changed) {
        const absFile = path.resolve(repoRoot, repoRelativeFile)

        for (const { pkg, absDir } of pkgDirs) {
            if (isInsideDir(absFile, absDir)) {
                hit.set(pkg.name, pkg)
                break
            }
        }
    }

    return [...hit.values()]
}
