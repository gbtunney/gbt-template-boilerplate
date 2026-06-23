import { json, Markdownlint, type MarkdownlintTool } from '@snailicid3/config'
const _config: MarkdownlintTool['config'] = Markdownlint.config({
    rules: { MD013: { 'line-length': 60 } },
})
console.log(json.prettyPrint(json.serialize(_config)))

export default Markdownlint.defineConfig(_config)
