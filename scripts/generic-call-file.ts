import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { getRepoRoot, getWorkspaceNodeModulesRoot } from './workspace-utils.js'
export type ImportMetaWithUrl = Pick<ImportMeta, 'url'>

function isCallerEntrypoint(
    callerMeta: ImportMetaWithUrl,
    opts: { log: boolean } | undefined = undefined,
): boolean {
    const { log: logEnabled = false }: Required<typeof opts> = opts ?? {
        log: false,
    } //opts?.log ?? false
    const log = (...args: Array<unknown>) => {
        if (!logEnabled) return
        // eslint-disable-next-line no-console
        console.log('[runIfMain]', ...args)
    }

    const entry = process.argv[1]
    const entryUrl: string | undefined = entry
        ? pathToFileURL(entry).href
        : undefined
    const isEntryPoint: boolean =
        entryUrl !== undefined && callerMeta.url === entryUrl
    path
    log('argv =', process.argv)
    log('argv[0] (node) =', process.argv[0])
    log('argv[1] (entry) =', entry)
    log('entryUrl =', entryUrl)
    log('callerMeta.url =', callerMeta.url)
    log('isMain =', isEntryPoint)
    return isEntryPoint
}

export const runIfEntrypoint = <
    Func extends (...any: any[]) => any = () => void,
>(
    callerMeta: ImportMetaWithUrl,
    mainFn: Func,
    ...args: Parameters<Func>
): ReturnType<Func> | void => {
    if (isCallerEntrypoint(callerMeta)) return mainFn(...args)
}

export const runIfEntrypointAsync = async <
    Func extends (...any: any[]) => Promise<any> = () => Promise<void>,
>(
    callerMeta: ImportMetaWithUrl,
    mainFn: Func,
    ...args: Parameters<Func>
): Promise<void | Awaited<ReturnType<Func>>> => {
    if (isCallerEntrypoint(callerMeta)) {
        return await mainFn(...args)
    }
}

const testme = (param: string, param2: string): string => {
    console.log(
        'param  is ',
        param,
        param2,
        'getWorkspaceRoot',
        getWorkspaceNodeModulesRoot(),
        'getRepoRoot',
        getRepoRoot(),
    )
    // pathToFileURL
    const repoRoot = getRepoRoot()
    const __resulty = path.resolve(fileURLToPath(import.meta.url))
    if (!repoRoot) throw new Error('Could not determine repo root')

    console.log('RESOLVE GLOB', path.isAbsolute('./scripts/*.ts'))
    const result = path.matchesGlob(__resulty, path.resolve('./sc*/**'))
    console.log(
        'result',
        __resulty,
        '<<    end',
        result,
        path.relative(fileURLToPath(import.meta.url), repoRoot),
    )

    return 'hhhhelllo'
}

runIfEntrypoint(import.meta, testme, 'hello world', 'paraaaa')
