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

const quoteArg = (p: string) => `"${p.replaceAll('"', '\\"')}"`

const toFileArgs = (stagedFiles: string | string[]) => {
    const arr = Array.isArray(stagedFiles) ? stagedFiles : [stagedFiles]
    return arr.map(quoteArg).join(' ')
}

const toIgnoreArgs = (ignores: string[]) => ignores.map(quoteArg).join(' ')

/** TODO: had to remove the type so i could use staged function */
const getLintStagedConfig = () => {
    const jsExt = getFileExtensionList(JSLIKE_FILE_EXTENSIONS)
    const prettierExt = getFileExtensionList<true>(PRETTIER_FILE_EXTENSIONS)
    const mdExt = getFileExtensionList<true>(['md'])

    return {
        /** Markdown */
        [`*.${mdExt.toString()}`]: (stagedFiles: string | string[]) => {
            const files = toFileArgs(stagedFiles)

            const markdownlintCmd = WARN_ONLY
                ? `pnpm exec markdownlint-cli2 ${files} ${toIgnoreArgs(mdIgnores)} || true`
                : `pnpm exec markdownlint-cli2 ${files} ${toIgnoreArgs(mdIgnores)}`

            return [`pnpm exec prettier --write ${files}`, markdownlintCmd]
        },

        /** JS-Like Files */
        [`*.{${jsExt.toString()}}`]: (stagedFiles: string | string[]) => {
            const files = toFileArgs(stagedFiles)
            return [
                `pnpm exec prettier --write ${files}`,
                `pnpm exec eslint --fix ${files}`,
            ]
        },

        /** Misc Prettier Files */
        [`*.{${prettierExt.toString()}}`]: (stagedFiles: string | string[]) => {
            const files = toFileArgs(stagedFiles)
            return `pnpm exec prettier --write ${files}`
        },

        '.gitignore': 'pnpm exec prettier --write .gitignore',

        '.husky/**/*': (stagedFiles: string | string[]) => {
            const files = toFileArgs(stagedFiles)
            return `pnpm exec prettier --write ${files}`
        },
    }
}

export default getLintStagedConfig()