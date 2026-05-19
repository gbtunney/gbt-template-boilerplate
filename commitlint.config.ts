/**
 * @file Commitlint configuration for the Monorepo.
 * @author Gillian Tunney
 * @see [commitlint - Lint commit messages](https://commitlint.js.org/#/)
 */
import { commitlint, type CommitlintUserConfig } from '@snailicid3/config'

const configuration: CommitlintUserConfig = commitlint.configuration([
    'root',
    'actions',
    'notes',
    'template-example-package',
    'todo:fix disable scope',
])
export default configuration
