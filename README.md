# gbt-template-boilerplate

Shared repository for commonly used files.
Includes things like:

- workspace setup
- code boilerplate
- configuration files

Provides a single source of truth for default instructions, reusable prompts, shell completions, recommended extensions, and automation checklists to standardize and accelerate new project onboarding.

Basically stuff I have a zillion copies of and constantly forget what I am doing :(

## TODO

- [ ] `.gitignore`
- [ ] Recommended extensions
- [ ] VSCode
  - [ ] Options
  - [ ] Macros
- [ ] Changeset settings
- [ ] Uninstall shell scripts
- [ ] `.lintstagedrc.mts`
- [ ] `.nvmrc`
- [ ] `pnpm-workspace.yaml`
- [ ] `.husky` pre-push — enforce commit rules, disallow commits to main
- [ ] GitHub ruleset file
- [ ] `.github` folder
  - [ ] Instructions
  - [ ] Actions
  - [ ] Prompts
    - [ ] Package key order instructions for Copilot prompt
    - [ ] Push/pull template file
    - [ ] Completions
    - [ ] Dependency audit
  - [ ] Issues setup
  - [ ] Other

## Repo-Specific Boilerplate

### Code Style

- [ ] `.markdownlint-cli2.mts`
- [ ] `prettier.config.ts`
- [ ] ESLint config

### Project Files

- [ ] `TODO.md` template
- [ ] Commit lint config (mostly for `cz` to utilize scope list)
- [ ] `README.md`
  - [ ] Separate header
- [ ] `nx.json` defaults
- [ ] Monorepo root boilerplate
  - [ ] `package.json`
  - [ ] `tsconfig.json`
  - [ ] `tsconfig.root.json`
- [ ] Example package boilerplate
  - [ ] ...

### Project-Specific Templates

- [ ] Generic reference docs for types, package anatomy, nx to `package.json`, etc.
- [ ] Common CLI commands I constantly forget, like:
  - [ ] Adding SSH to agent
  - [ ] Copy file contents to clipboard
  - [ ] ... I'm sure there are many

### Future

- [ ] List of repositories for reference
- [ ] Way of using something as a generic formatter (via Actions?)
  - Upload file without committing ideally
  - Runs standard fixer (Prettier, ESLint, markdownlint)
  - Lists non-blocking lint errors
  - Dumps the file somewhere to be cut/pasted or made into an artifact
