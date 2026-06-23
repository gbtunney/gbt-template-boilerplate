import { Prettier, type PrettierTool } from '@snailicid3/config'
const config: PrettierTool['config'] = Prettier.defineConfig(Prettier.config())
export default config
