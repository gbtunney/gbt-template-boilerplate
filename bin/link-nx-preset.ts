/**
 * TEMPORARY: link the Nx preset from a local snailicid3 checkout.
 *
 * `nx.json` extends `@snailicid3/config/nx-preset.json`, but that artifact is generated at build time and is not in the
 * published `@snailicid3/config` yet. Until a version shipping `dist/nx-preset.json` is on npm, this copies the file
 * from a local snailicid3 checkout into `node_modules` so `extends` resolves and the pipeline can be exercised.
 *
 * `node_modules` is gitignored, so this leaves no trace in the repo. Re-run it after `pnpm install`, or after
 * rebuilding the preset in snailicid3.
 *
 * Usage: pnpm nx:preset:link # defaults to ../snailicid3 SNAILICID3_PATH=/path/to/snailicid3 pnpm nx:preset:link
 *
 * DELETE this script (and its package.json entry) once the preset is published.
 */
import {
    copyFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PRESET_RELATIVE = 'packages/config/dist/nx-preset.json'
const SUBPATH = './nx-preset.json'

const snailicid3 = resolve(process.env.SNAILICID3_PATH ?? '../snailicid3')
const source = join(snailicid3, PRESET_RELATIVE)

if (!existsSync(source)) {
    console.error(`✖ Preset not found: ${source}`)
    console.error('')
    console.error(
        '  Checkout snailicid3 next to this repo and build the config package:',
    )
    console.error('    pnpm exec nx run @snailicid3/config:build')
    console.error('')
    console.error('  Or point at it explicitly:')
    console.error('    SNAILICID3_PATH=/path/to/snailicid3 pnpm nx:preset:link')
    process.exit(1)
}

/**
 * Resolve the real installed package dir (pnpm symlinks into `.pnpm/...`). The installed version does not export
 * `./package.json`, so resolve its main entry and walk up to the package root instead.
 */
let packageDir
try {
    // The package's exports map is import-only, so resolve the ESM entry (dist/index.js) and walk up two levels.
    packageDir = dirname(
        fileURLToPath(import.meta.resolve('@snailicid3/config')),
    )
    packageDir = dirname(packageDir)
} catch {
    console.error(
        '✖ @snailicid3/config is not installed. Run `pnpm install` first.',
    )
    process.exit(1)
}

const packageJsonPath = join(packageDir, 'package.json')
if (!existsSync(packageJsonPath)) {
    console.error(
        `✖ Could not locate the installed package root (looked in ${packageDir}).`,
    )
    process.exit(1)
}
const target = join(packageDir, 'dist/nx-preset.json')

mkdirSync(dirname(target), { recursive: true })
copyFileSync(source, target)

// The installed version predates the export subpath, so add it if missing.
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
if (packageJson.exports && !packageJson.exports[SUBPATH]) {
    packageJson.exports[SUBPATH] = './dist/nx-preset.json'
    writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`)
    console.log(`✔ Added "${SUBPATH}" export to the installed package`)
}

console.log(`✔ Linked preset from ${source}`)
console.log('  nx.json > extends now resolves. Re-run after `pnpm install`.')
