import { lintstaged,LintStagedConfiguration } from '@snailicid3/config'
console.log("hi,",lintstaged)
const config:LintStagedConfiguration = await lintstaged.configuration()
console.log("gbtcconfig", JSON.stringify(config, null, 2))
export default config