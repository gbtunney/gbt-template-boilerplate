import {
    getFileExtensionList,
    JSLIKE_FILE_EXTENSIONS,
    PRETTIER_FILE_EXTENSIONS,
} from '@snailicide/build-config'

//TODO: figure out a way this is not utterly ridiculous
const mdIgnores = [
    '#**/{node_modules,.changeset,docs,scratch}/**',
    '#packages/cli-template/templates/**/*',
    '#api/gbt-tuya-device',
]

// If true, markdownlint will run but will not block commits
const WARN_ONLY: boolean = true

const quotePath = (p: string) => `"${p.replaceAll('"', '\\"')}"`
const toFileArgs = (stagedFiles: string | string[]) => {
    const arr = Array.isArray(stagedFiles) ? stagedFiles : [stagedFiles]
    return arr.map(quotePath).join(' ')
}

/** TODO: had to remove the type so i could use staged function */
const getLintStagedConfig = () => {
    const jsExt = getFileExtensionList(JSLIKE_FILE_EXTENSIONS)
    const prettierExt = getFileExtensionList<true>(PRETTIER_FILE_EXTENSIONS)
    const mdExt = getFileExtensionList<true>(['md'])

    const configExample = {
        /** Markdown */
        [`*.${mdExt.toString()}`]: (stagedFiles: string | Array<string>) => {
            const files = toFileArgs(stagedFiles)

            const markdownlintCmd = WARN_ONLY
                ? `pnpm exec markdownlint-cli2 ${files} ${mdIgnores.join(' ')} || true`
                : `pnpm exec markdownlint-cli2 ${files} ${mdIgnores.join(' ')}`

            return [
                // Only format the staged markdown files
                `pnpm exec prettier --write ${files}`,
                // Lint only the staged markdown files (optionally warn-only)
                markdownlintCmd,
            ]
        },

        /** JS-Like Files */
        [`*.{${jsExt.toString()}}`]: (stagedFiles: string | Array<string>) => {
            const files = toFileArgs(stagedFiles)
            return [
                `pnpm exec prettier --write ${files}`,
                `pnpm exec eslint --fix ${files}`,
            ]
        },

        /** Misc Prettier Files */
        [`*.{${prettierExt.toString()}}`]: (stagedFiles: string | Array<string>) => {
            const files = toFileArgs(stagedFiles)
            return `pnpm exec prettier --write ${files}`
        },

        /** Shell Scripts and Ignores */
        '.gitignore': 'pnpm exec prettier --write .gitignore',
        '.husky/**/*': (stagedFiles: string | Array<string>) => {
            const files = toFileArgs(stagedFiles)
            return `pnpm exec prettier --write ${files}`
        },
    }
    return configExample
}

export default getLintStagedConfig()