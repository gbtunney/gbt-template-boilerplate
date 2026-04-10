/**
 * @file Commitlint configuration for the Monorepo.
 * @author Gillian Tunney
 * @see [commitlint - Lint commit messages](https://commitlint.js.org/#/)
 */
import { commitlint, CommitlintUserConfig } from '@snailicide/build-config'

const Configuration: CommitlintUserConfig = commitlint.configuration([
    'root',
    'notes',
    '@gbt/hb-api',
    '@gbt/ha-dashboard',
    '@gbt/home-assistant',
    '@gbt/pyscript-kit',
    '@gbt/tuya-device',
    '@gbt/example-package',
    'todo:fix disable scope',
])

export default Configuration
