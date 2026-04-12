import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'
import { getWorkspacePackagesList } from './workspace-utils.js'
import { runIfEntrypoint, runIfEntrypointAsync } from './generic-call-file.js'
type Args = {
    maxNamed: number
    base: string | undefined
    head: string | undefined
}

function run(cmd: string): string {
    try {
        return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })
            .toString('utf8')
            .trim()
    } catch {
        return ''
    }
}

function lines(s: string): Array<string> {
    return s
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
}

function parseArgs(argv: string[]): Args {
    let maxNamed = 3
    let base: string | undefined
    let head: string | undefined

    for (let i = 0; i < argv.length; i++) {
        const a = argv[i]
        if (a === '--max') maxNamed = Number(argv[++i] ?? '3')
        else if (a === '--base') base = argv[++i]
        else if (a === '--head') head = argv[++i]
        else throw new Error(`Unknown argument: ${a}`)
    }

    return { maxNamed, base, head }
}

function repoRoot(): string {
    return run('git rev-parse --show-toplevel') || process.cwd()
}

function isInsideDir(absChildPath: string, absParentDir: string): boolean {
    const rel = path.relative(absParentDir, absChildPath)
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))
}

function getChangedFiles(args: Args): string[] {
    const files = new Set<string>()

    const add = (cmd: string) => {
        for (const f of lines(run(cmd))) files.add(f)
    }

    // Committed range (CI)
    if (args.base && args.head) {
        add(`git diff --name-only ${args.base}...${args.head}`)
    }

    // Local dirty state (helps when running manually)
    add('git diff --name-only --cached')
    add('git diff --name-only')
    add('git ls-files --others --exclude-standard')

    return [...files]
}

function main() {
    const args = parseArgs(process.argv.slice(2))
    const root = repoRoot()

    const changedFiles = getChangedFiles(args)
    const absChangedFiles = changedFiles.map((f) => path.resolve(root, f))

    const scopes = new Set<string>()

    // scripts scope
    const scriptsDir = path.resolve(root, 'scripts')
    if (absChangedFiles.some((f) => isInsideDir(f, scriptsDir))) {
        scopes.add('scripts')
    }

    // workspace scope for root-level infra files (tweak list as you like)
    const workspaceInfra = new Set([
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'package.json',
        'nx.json',
        'tsconfig.base.json',
    ])

    if (changedFiles.some((f) => workspaceInfra.has(f))) {
        scopes.add('workspace')
    }

    // package scopes from git paths
    const pkgs = getWorkspacePackagesList()
    const pkgDirs = pkgs
        .map((pkg) => ({
            pkg,
            absDir: path.resolve(root, pkg.path),
        }))
        .sort((a, b) => b.absDir.length - a.absDir.length)

    for (const absFile of absChangedFiles) {
        for (const { pkg, absDir } of pkgDirs) {
            if (isInsideDir(absFile, absDir)) {
                scopes.add(pkg.name)
                break
            }
        }
    }

    const list = [...scopes].filter(Boolean).sort()

    let scope: string
    if (list.length === 0) scope = 'workspace'
    else if (list.length <= args.maxNamed) scope = list.join(', ')
    else scope = 'workspace'

    process.stdout.write(scope + '\n')
}

runIfEntrypoint(import.meta, main)
